const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
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
    },
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
)

const agentModel = mongoose.model('agent', agentSchema);
module.exports = agentModel;