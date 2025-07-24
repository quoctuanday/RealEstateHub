const { sendToDialogflow } = require('../config/dialog');
const Notification = require('../models/Notification');
const User = require('../models/User');

class ChatBotController {
    createAdminNotification = async (userMessage) => {
        try {
            const admins = await User.find({ role: 'admin' });

            if (!admins.length) {
                console.warn('Không tìm thấy admin nào để gửi thông báo.');
                return;
            }

            const notifications = admins.map((admin) => ({
                userId: admin._id,
                title: 'Câu hỏi chưa có câu trả lời',
                message: `Người dùng hỏi: "${userMessage}". Vui lòng cập nhật ChatBot.`,
            }));

            await Notification.insertMany(notifications);
            console.log('Đã gửi thông báo đến admin.');
        } catch (error) {
            console.error('Lỗi tạo thông báo cho admin:', error);
        }
    };

    chat = async (req, res) => {
        const message = req.body.data.messages;
        console.log('User message:', message);

        try {
            const reply = await sendToDialogflow(message);

            if (!reply || reply.trim() === 'Tôi không biết') {
                await this.createAdminNotification(message);
                return res.json({
                    reply: 'Hiện tại tôi chưa có câu trả lời cho câu hỏi này, nhưng tôi sẽ ghi nhận để cải thiện trong tương lai.',
                });
            }

            res.json({ reply });
        } catch (err) {
            console.error('Lỗi gọi Dialogflow:', err);

            await this.createAdminNotification(message);

            res.status(500).json({
                reply: 'Hiện tại tôi chưa có câu trả lời cho câu hỏi này, nhưng tôi sẽ ghi nhận để cải thiện trong tương lai.',
            });
        }
    };
}

module.exports = new ChatBotController();
