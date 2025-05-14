const { sendToDialogflow } = require('../config/dialog');

class ChatBotController {
    async chat(req, res) {
        const message = req.body.data.messages;
        console.log(message);
        try {
            const reply = await sendToDialogflow(message);
            res.json({ reply });
        } catch (err) {
            console.error('Lỗi gọi Dialogflow:', err);
            res.status(500).json({ reply: 'Tôi không biết' });
        }
    }
}
module.exports = new ChatBotController();
