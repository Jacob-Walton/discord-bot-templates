const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: mongoose.Schema.Types.Mixed,
    type: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);