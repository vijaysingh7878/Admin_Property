const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const propertyController = require('../controller/propertyController');
const authAdmin = require('../Middleware/authAdmin');
const propertyRouter = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Property'
    },
})
const uploadImg = multer({ storage: storage });

// property create part
propertyRouter.post('/create', uploadImg.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'maltipleImage', maxCount: 4 }
]),
    async (req, res) => {
        const result = await new propertyController().createProperty(req.body, req.files).then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    })

// property read part
propertyRouter.get('/read', (req, res) => {
    const result = new propertyController().propertyRead(req.query).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// deleteProperty part 
propertyRouter.delete('/delete/:id', (req, res) => {
    const result = new propertyController().propertyDelete(req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// edit property part
propertyRouter.put('/edit-property/:id', uploadImg.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'maltipleImage', maxCount: 4 }
]), async (req, res) => {
    const result = new propertyController().propertyEdit(req.body, req.files, req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// otherImg pert edit
propertyRouter.patch('/edit-property/:id', async (req, res) => {
    const result = new propertyController().otherImgEdit(req.body.url, req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// statusChange part
propertyRouter.put('/status-change', async (req, res) => {
    const result = new propertyController().statusChange(req.query, req.body).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

module.exports = propertyRouter;