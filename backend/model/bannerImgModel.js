const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
    },
    banner_Category: {
        type: String,
        enum: ['home', 'jaipur', 'service', 'blog', 'contact'],
        default: 'home'
    },
    status: {
        type: Boolean,
        default: true
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const bannerModel = mongoose.model('banner', BannerSchema);
module.exports = bannerModel;
