const express = require('express');
const ReqController = require('../controller/reqController');
const authAdmin = require('../Middleware/authAdmin');
const reqRouter = express.Router();

// create req part
reqRouter.post('/create', authAdmin, (req, res) => {
    const result = new ReqController().createReq(req.user.id, req.body);
    result.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )

})

// read req part
reqRouter.get('/read', authAdmin, (req, res) => {
    const result = new ReqController().readReq(req.query);
    result.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// detele req part
reqRouter.delete('/delete/:id', (req, res) => {
    const result = new ReqController().reqDelete(req.params.id);
    result.then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )

})
module.exports = reqRouter;