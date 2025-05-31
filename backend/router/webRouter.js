// const express = require('express');
// const webController = require('../controller/webController');
// const webRouter = express.Router();

// webRouter.post('/create', (req, res) => {
//     const result = new webController().add(req.body, req.file).then(
//         (success) => {
//             res.send(success);
//         }
//     ).catch(
//         (error) => {
//             res.send(error);
//         }
//     )
// })

// webRouter.get('/read', (req, res) => {
//     const result = new webController().read(req.query).then(
//         (success) => {
//             res.send(success);
//         }
//     ).catch(
//         (error) => {
//             res.send(error);
//         }
//     )
// })

// webRouter.put('/update', (req, res) => {
//     const result = new webController().update(req.query).then(
//         (success) => {
//             res.send(success);
//         }
//     ).catch(
//         (error) => {
//             res.send(error);
//         }
//     )
// })

// module.exports = ratingRouter;
