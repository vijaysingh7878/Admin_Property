const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String
    },
    location: {
        type: String
    },
    profile_Photo: {
        type: String,
    }
},
    {
        timestamps: true
    }
)
const adminModel = mongoose.model('admin', adminSchema);
module.exports = adminModel;