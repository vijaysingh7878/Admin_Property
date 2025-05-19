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
        status: {
            type: String,
            enum: ['available', 'sold', 'soon'],
            default: 'available'
        }
    },
    {
        timestamps: true
    }
);

const propertyModel = mongoose.model('property', propertySchema);
module.exports = propertyModel;