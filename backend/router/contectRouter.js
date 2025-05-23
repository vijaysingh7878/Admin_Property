const express = require('express');
const ContactController = require('../controller/contectController');
const contectRouter = express.Router();


// POST /contact/create — create a new contact
contectRouter.post('/create', async (req, res) => {
    const result = new ContactController().createContact(req.body).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
});

// read part
// contectRouter.get('/all', async (req, res) => {
//     try {
//         const contacts = await Contact.find().sort({ createdAt: -1 });
//         res.status(200).json({
//             msg: 'All contacts fetched',
//             status: 1,
//             data: contacts,
//         });
//     } catch (error) {
//         console.error('Fetch contacts error:', error);
//         res.status(500).json({
//             msg: 'Internal server error',
//             status: 0,
//         });
//     }
// });

module.exports = contectRouter;
