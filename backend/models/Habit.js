const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    createdAt: { type: Date, default: Date.now }
});

habitSchema.index({ isActive: 1, createdAt: -1 });
module.exports = mongoose.model('Habit', habitSchema);
