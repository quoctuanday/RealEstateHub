const mongoose = require('mongoose');
const User = require('./User');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        title: { type: String, required: true },
        description: { type: String, required: true },
        location: {
            name: { type: String, required: true },
            coordinates: {
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true },
            },
        },
        features: {
            bathroom: { type: Number },
            room: { type: Number },
            convenients: { type: [String] },
        },
        acreage: { type: Number, required: true },
        images: { type: [String], required: true },
        urlSaveImages: { type: String },
        price: { type: Number, required: true },
        isAvailable: { type: Boolean, required: true, default: false },
        isCheckout: { type: Boolean, required: true, default: false },
        rate: { type: Number, default: 0 },
        feedBack: { type: String },
        postType: { type: String, enum: ['sell', 'rent'], required: true },
        houseType: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

PostSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = mongoose.model('Post', PostSchema);
