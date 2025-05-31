const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        mainImage: {
            type: String,
            require: true
        },
        video: {
            type: String
        },
        document: {
            type: String
        },
        state: {
            type: String
        },
        city: {
            type: String
        },
        address: {
            type: String
        },
        area: {
            type: String
        },
        category: {
            type: String
        },
        propertyType: {
            type: String,
            enum: ['buy', 'sell', 'rent'],
        },
        price: {
            type: String
        },
        maltipleImage: [
            {
                type: String,
                require: true
            }
        ],
        short_description: {
            type: String
        },
        long_description: {
            type: String
        },
        user_Id: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            require: true
        },
        action: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        tag: {
            type: String,
            enum: ['featured', 'discount', 'popular'],
            default: 'featured'
        },
        status: {
            type: String,
            enum: ['available', 'sold', 'soon', 'rentedBooked'],
            default: 'available'
        },
        rentDetails: {
            rentStart: {
                type: Date,
            },
            expiredOn: {
                type: Date,
            },
            monthlyRent: {
                type: Number,
                trim: true,
            },
            status: {
                type: Boolean,
                default: false,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

const propertyModel = mongoose.model('property', propertySchema);
module.exports = propertyModel;