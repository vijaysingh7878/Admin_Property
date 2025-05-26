const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    property_Id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'property'
    },
    propertyOwnerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    requestType: {
        type: String,
        enum: ['buy','rent']
        // default: 'visit'
    },
    message: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const reqModel = mongoose.model('request', requestSchema);
module.exports = reqModel;
