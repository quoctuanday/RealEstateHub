const { GoogleGenerativeAI } = require('@google/generative-ai');
const { BOT_GPT_API } = require('../config/env');

const genAI = new GoogleGenerativeAI(BOT_GPT_API);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

class ChatGPTController {
    async generateTitle(req, res) {
        try {
            const postData = req.body.data;
            const features = postData.features || {};
            console.log(postData);

            const prompt = `Bạn là một chuyên gia viết bài cho bất động sản tại Việt Nam.
                    Dựa trên thông tin dưới đây, hãy tạo một tiêu đề hấp dẫn và mô tả chi tiết, mô tả đúng các thông tin được đưa vào, không 
                    chỉnh sửa khác với thông tin được đưa ra. 
                    - Phần mô tả dựa vào thông tin đã cho viết sao để hấp dẫn người dùng, nhớ chỉ để 3 số đầu số điện thoại, các số còn lại chuyển thành * để bảo mật 
                    - Dựa vào vị trí địa chỉ để viết thêm trong phần mô tả các khu vực dịch vụ, tiện ích xung quanh vị trí đó.
                    - Phần tiêu đề dựa vào loại tin đăng phải ghi rõ là mua hay bán.
                    - Các mục trong mô mả có thể chia thành nhiều phần và xuống dòng 1 cách hợp lý.
                    - Chỉ được tạo tiêu đề và viết mô tả, không thêm hướng dẫn hay gì hết cho người dùng:

                    Loại tin: ${postData.postType}
                    Loại bất động sản: ${postData.houseType}
                    Địa chỉ: ${postData.location?.name || ''}
                    Diện tích: ${postData.acreage || ''} m²
                    Giá: ${postData.price || ''} VND
                    Người liên hệ: ${postData.userName || ''}
                    SDT: ${postData.phoneNumber || ''}
                    Số phòng: ${features.room || ''}
                    Số nhà vệ sinh: ${features.bathroom || ''}
                    Các tiện nghi: ${
                        features.convenients
                            ? features.convenients.join(', ')
                            : ''
                    }

                    (Nếu có số phòng, số nhà vệ sinh, các tiện nghi thì mô tả thêm, không thì thôi)

                    Trả về dưới định dạng sau:
                    Tiêu đề: [tiêu đề hấp dẫn]
                    Mô tả: [mô tả chi tiết]`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const titleMatch = responseText.match(/Tiêu đề:\s*(.+)/);
            const descriptionMatch = responseText.match(/Mô tả:\s*(.+)/s);

            const title = titleMatch
                ? titleMatch[1].trim()
                : 'Không có tiêu đề';
            const description = descriptionMatch
                ? descriptionMatch[1].trim()
                : 'Không có mô tả';

            res.status(200).json({ title, description });
        } catch (error) {
            console.error('Lỗi khi gọi Google Gemini API:', error);
            res.status(500).json({
                error: 'Lỗi khi gọi Google Gemini API',
                details: error.message,
            });
        }
    }
}

module.exports = new ChatGPTController();
