const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        profile_Photo: {
            type: String,
        },
        password: {
            type: String,
        },
        phone: {
            type: String
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: Boolean,
            default: true
        },
        location: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;