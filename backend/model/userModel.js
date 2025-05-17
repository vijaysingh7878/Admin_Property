const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        profile_Photo: String,
        password: {
            type: String,
            required: true,
            minlength: 6 
        },
        phone: String,
        email: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: Boolean,
            default: true
        },
        location: String,
        likedProperties: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'property'
            }
        ],
        soldProperties: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'property'
            }
        ]
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
