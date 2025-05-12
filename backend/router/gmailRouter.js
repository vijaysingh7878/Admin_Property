const express = require('express');
const { sendEmail, verify } = require('../Middleware/nodemailer');
const emailRouter = express.Router();

emailRouter.post('/otp-send', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }
    try {
        const Otp_Generate = await sendEmail(req.body);
        res.status(200).json({ msg: 'Email sent', status: 1 });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Email failed', error: error.message });
    }
})

// verify part
emailRouter.post('/verify', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }
    try {
        const isVerify = await verify(req.body);
        res.status(200).json(isVerify);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'otp not match', error: error.message });
    }
})
module.exports = emailRouter;