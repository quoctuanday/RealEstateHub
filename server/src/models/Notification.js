const mongoose = require('mongoose');
const User = require('./User');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        title: { type: String },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

NotificationSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = mongoose.model('Notification', NotificationSchema);
