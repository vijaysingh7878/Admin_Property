const express = require('express');
const ratingController = require('../controller/ratingController');
const ratingRouter = express.Router();

ratingRouter.post('/create', (req, res) => {    
    const result = new ratingController().addRating(req.body).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

ratingRouter.get('/read', (req, res) => {    
    const result = new ratingController().getRatingsByAgent(req.query).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

module.exports = ratingRouter;
