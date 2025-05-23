const mongoose = require('mongoose');
const User = require('./User');
const mongooseDelete = require('mongoose-delete');
const Post = require('./Post');
const Schema = mongoose.Schema;
const Comment = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: Post },
        content: { type: String, required: true },
        isBlocked: { type: Boolean, default: false },
        rate: { type: Number, required: true },
    },
    { timestamps: true }
);
Comment.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = mongoose.model('Comment', Comment);
