const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const authenticateToken = require('../middleware/auth');

router.put(
    '/vnpay/callback',
    authenticateToken,
    PaymentController.callbackVnpay
);
router.post(
    '/vnpay/create',
    authenticateToken,
    PaymentController.createPayment
);

module.exports = router;
