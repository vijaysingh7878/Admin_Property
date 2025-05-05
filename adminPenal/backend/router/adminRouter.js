const express = require('express');
const adminController = require('../controller/adminController');
const adminRouter = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const authAdmin = require('../Middleware/authAdmin');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'admin'
    }
})

const adminImg = multer({ storage: storage });
// admin create part
adminRouter.post('/create', adminImg.single('adminProfile'), (req, res) => {
    const result = new adminController().createAdmin(req.body);
    result.then(
        (success) => {
            res.send(success)
        }
    ).catch(
        (error) => {
            res.send(error)
        }
    )
})

// admin read part
adminRouter.get('/read', (req, res) => {
    const result = new adminController().readAdmin(req.query).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// admin login chack part
adminRouter.post('/login', async (req, res) => {
    try {
        const result = await new adminController().loginAdmin(req.body);
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

// admin update part
adminRouter.patch('/admin-update/:id', authAdmin, adminImg.single('adminProfile'), async (req, res) => {
    const result = new adminController().editAdmin(req.body, req.file, req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})


module.exports = adminRouter;