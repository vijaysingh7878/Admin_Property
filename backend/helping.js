require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const generateImageName = (name) => {
    return uuidv4() + String(name)
}

// jwt token
const tokenGenerate = (data) => jwt.sign(data, process.env.SECRET_KEY);
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.error('Token verification failed:', error.message);
        throw new Error('Invalid or expired token');
    }
};

module.exports = { generateImageName, tokenGenerate, verifyToken };


