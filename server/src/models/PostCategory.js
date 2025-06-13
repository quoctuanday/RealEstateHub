const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./Post');
const Category = require('./Category');

const PostCategorySchema = new Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Post,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Category,
            required: true,
        },
    },
    {
        timestamps: true,
        index: { unique: true, fields: ['postId', 'categoryId'] },
    }
);

module.exports = mongoose.model('PostCategory', PostCategorySchema);
