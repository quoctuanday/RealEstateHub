const Notify = require('../models/Notification');
const { notify } = require('../routes/user');

class Notification {
    getNotify(req, res) {
        const userId = req.user.userId;
        Notify.find({ userId: userId })
            .then((notify) => {
                if (!notify) {
                    res.status(404).json({ message: 'Notification not found' });
                }
                res.status(200).json({
                    message: 'List of notification',
                    notify,
                });
            })
            .catch((error) => {
                console.log('Get notification error :', error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }

    update(req, res) {
        const notifyId = req.params.id;
        const data = req.body.data;
        console.log(notifyId, data);
        Notify.findByIdAndUpdate(notifyId, data)
            .then((notification) => {
                if (!notification) {
                    res.status(404).json({ message: 'Notification not Found' });
                }
                res.status(200).json({ message: 'Notification updated' });
            })
            .catch((error) => {
                console.log('Updated notification error :', error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }
    async delete(req, res) {
        try {
            const notifyId = req.params.id;

            const result = await Notify.deleteOne({ _id: notifyId });

            if (result.deletedCount === 0) {
                return res
                    .status(404)
                    .json({ message: 'Thông báo không tồn tại' });
            }

            return res
                .status(200)
                .json({ message: 'Xóa thông báo thành công' });
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error);
            return res
                .status(500)
                .json({ message: 'Lỗi server khi xóa thông báo' });
        }
    }
}
module.exports = new Notification();
