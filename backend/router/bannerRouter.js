const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bannerController = require('../controller/bannerController');
const bannerRouter = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'banner'
    }
})

const banner_Img = multer({ storage: storage })

// banner create part
bannerRouter.post('/create', banner_Img.single('bannerImage'), (req, res) => {
    const result = new bannerController().createBanner(req.body, req.file).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// banner read part
bannerRouter.get('/read', (req, res) => {
    const result = new bannerController().readBanner().then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// banner status change part
bannerRouter.patch('/status-change/:id', (req, res) => {
    const result = new bannerController().status_Changr(req.body, req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// banner delete part
bannerRouter.delete('/delete/:id', (req, res) => {
    const result = new bannerController().delete_Banner(req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})
module.exports = bannerRouter;