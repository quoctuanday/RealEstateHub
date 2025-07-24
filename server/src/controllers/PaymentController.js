const axios = require('axios');
const crypto = require('crypto');
const User = require('../models/User');
const moment = require('moment-timezone');
const TransactionHistory = require('../models/TransactionHistory');
const Notification = require('../models/Notification');
const {
    vnp_Api,
    vnp_Url,
    vnp_ReturnUrl,
    vnp_HashSecret,
    vnp_TmnCode,
} = require('../config/env/index');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            '+'
        );
    }
    return sorted;
}

class PaymentController {
    // Vnpay
    async createPayment(req, res) {
        var ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const data = req.body.data;
        const userID = req.user.userId;
        console.log('ipaddr:', ipAddr, data, userID);

        var tmnCode = vnp_TmnCode;
        var secretKey = vnp_HashSecret;
        var vnpUrl = vnp_Url;
        var date = new Date();
        var createDate = moment(date)
            .tz('Asia/Ho_Chi_Minh')
            .format('YYYYMMDDHHmmss');
        const randomStr = Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase();
        var orderId = randomStr + userID;
        var amount = data.amount;
        var bankCode = 'VNBANK';

        var orderInfo = 'Khong co thong tin';

        var orderType = 'fashion';
        var locale = 'vn';
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        console.log('vnpUrl:', vnpUrl);
        console.log('vnp_TxnRef:', orderId);

        res.json({ vnpUrl: vnpUrl });
    }

    async callbackVnpay(req, res) {
        const userId = req.user.userId;
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var secretKey = vnp_HashSecret;
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require('crypto');
        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
            var rspCode = vnp_Params['vnp_ResponseCode'];
            const amount = vnp_Params['vnp_Amount'] / 100;
            try {
                await User.findByIdAndUpdate(
                    userId,
                    { $inc: { accountBalance: amount } },
                    { new: true }
                );

                await TransactionHistory.create({
                    userId: userId,
                    amount: amount,
                });
                await Notification.create({
                    userId: userId,
                    title: 'Nạp tiền thành công',
                    message: `Tài khoản của bạn đã được cộng ${amount.toLocaleString(
                        'vi-VN'
                    )} VNĐ.`,
                });

                res.status(200).json({ RspCode: '00', Message: 'success' });
            } catch (err) {
                console.error(
                    'Error updating balance or creating history:',
                    err
                );
                res.status(500).json({
                    RspCode: '99',
                    Message: 'Internal server error',
                });
            }
        } else {
            res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
        }
    }
}
module.exports = new PaymentController();
