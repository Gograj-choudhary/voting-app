const { compare } = require('bcrypt');
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        unique: true,
        required: true,
    },
    adminId: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});



module.exports = mongoose.model('room', roomSchema);