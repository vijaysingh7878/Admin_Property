const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const agentController = require('../controller/agentController');
const authAdmin = require('../Middleware/authAdmin');
const agentRouter = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'users'
    }
})

const agentImg = multer({ storage: storage })

// agent create part
agentRouter.post('/create', agentImg.single('agentProfile'), (req, res) => {
    const result = new agentController().createAgent(req.body, req.file).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})


// agent read part
agentRouter.get('/read',authAdmin, (req, res) => {
    const result = new agentController().readAgent(req.query).then(
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
agentRouter.put('/status-change', async (req, res) => {
    const result = new agentController().statusChangeAgent(req.query).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})
// remove-profile part
agentRouter.put('/remove-profile', async (req, res) => {
    const result = new agentController().removeProfileAgent(req.query).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// agent update part
agentRouter.patch('/agent-update/:id', agentImg.single('agentProfile'), async (req, res) => {
    const result = new agentController().editAgent(req.body, req.file, req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// agent login chack part
agentRouter.post('/login', async (req, res) => {
    try {
        const result = await new agentController().loginAgent(req.body);
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

module.exports = agentRouter;