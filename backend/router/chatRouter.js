const express = require('express');
const chatController = require('../controller/chatController');
const chatRouter = express.Router();

chatRouter.post('/create', async (req, res) => {
    console.log(req.body);
    
    try {
        const result = await new chatController().createChat(req.body);
        res.send(result)
    }
    catch (error) {
        res.send(error)
    }
})
chatRouter.get('/read', async (req, res) => {
    try {
        const result = await new chatController().readChat(req.query);
        res.send(result)
    }
    catch (error) {
        res.send(error)
    }
})


module.exports = chatRouter;