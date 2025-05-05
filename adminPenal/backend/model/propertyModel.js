const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        mainImage: {
            type: String
        },
        state: {
            type: String
        },
        district: {
            type: String
        },
        area: {
            type: String
        },
        category: {
            type: String
        },
        price: {
            type: String
        },
        maltipleImage: [
            {
                type: String
            }
        ],
        short_description: {
            type: String
        },
        long_description: {
            type: String
        },
        agentId: {
            type: mongoose.Schema.ObjectId,
            ref: 'agent',
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
        }
    },
    {
        timestamps: true
    }
);

const propertyModel = mongoose.model('property', propertySchema);
module.exports = propertyModel;