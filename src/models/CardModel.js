const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        unique: true,
    },
    cardType: {
        type: String,
        required: true,
        enum: ['REGULAR', 'SPECIAL'],
    },
    customerName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    vision: {
        type: String,
        required: true,
    },
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    }
}, { timestamps: true });

cardSchema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        const count = await this.model('Card').countDocuments();
        const paddedCount = (count + 1).toString().padStart(3, '0');
        this.cardNumber = `C${paddedCount}`;
      }
      next();
    } catch (error) {
      next(error);
    }
});

module.exports = mongoose.model('Card', cardSchema);