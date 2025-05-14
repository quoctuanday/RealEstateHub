const mongoose = require('mongoose');
const User = require('./User');
const mongooseDelete = require('mongoose-delete');
const Post = require('./Post');
const Schema = mongoose.Schema;
const Documents = new Schema(
    {
        title: { type: String, required: true },
        fileUrl: { type: String, required: true },
        source: { type: String, default: false },
        sourceUrl: { type: String, required: true },
    },
    { timestamps: true }
);
Documents.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = mongoose.model('Documents', Documents);
