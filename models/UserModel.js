const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Event'
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)