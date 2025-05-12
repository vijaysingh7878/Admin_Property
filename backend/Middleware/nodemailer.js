require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.APP_PASS
    }
})

let storeOTP;
async function sendEmail({ Email }) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    storeOTP = otp
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: Email,
        subject: 'Email from Frontend Request',
        text: `Do not share OTP - ${otp}`
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
}

async function verify({ otpValue }) {
    if (!otpValue) {
        return { status: 0, msg: 'OTP not generated yet' };
    }
    if (otpValue == storeOTP) {
        return { status: 1, msg: 'OTP is valid' };
    } else {
        return { status: 0, msg: 'Invalid OTP' };
    }
}

module.exports = { sendEmail, verify };