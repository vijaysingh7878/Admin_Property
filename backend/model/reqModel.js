const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    property_Id: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'property'
    },
    requestType: {
        type: String,
        enum: ['visit', 'buy'],
        default: 'visit'
    },
},
    {
        timestamps: true
    }
)

const reqModel = mongoose.model('request', requestSchema);
module.exports = reqModel;