const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['user', 'agent','admin'],
            default: 'user'
        },
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
        company: {
            type: String,
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
        ],
        property: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'property',
                require: true
            }
        ],
        rating: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'rating'
            }
        ]
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
