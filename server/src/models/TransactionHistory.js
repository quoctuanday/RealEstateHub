const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const TransactionHistorySchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
        amount: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('TransactionHistory', TransactionHistorySchema);
