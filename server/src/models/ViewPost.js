const mongoose = require('mongoose');
const User = require('./User');
const Post = require('./Post');
const Schema = mongoose.Schema;
const ViewPost = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: Post },
    },
    { timestamps: true }
);

module.exports = mongoose.model('ViewPost', ViewPost);
