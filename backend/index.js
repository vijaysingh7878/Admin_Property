require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2
const propertyRouter = require('./router/propertyRouter');
const userRouter = require('./router/userRouter');
const agentRouter = require('./router/agentRouter');
const adminRouter = require('./router/adminRouter');
const blogRouter = require('./router/blogRouter');
const reqRouter = require('./router/reqRouter');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const chatRouter = require('./router/chatRouter');
const chatSocket = require('./socket_IO/chatSocket');
const server = http.createServer(app);
const allowedOrigins = process.env.CORS_ORIGIN.split(',');

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, origin);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    }
});

app.use(cors({
    origin: function (origin, callback) {
        // If there's no origin (e.g., for non-browser requests like curl), allow it
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(express.json())
app.use('/property', propertyRouter);
app.use('/user', userRouter);
app.use('/agent', agentRouter);
app.use('/admin', adminRouter);
app.use('/blog', blogRouter);
app.use('/req', reqRouter);
app.use('/chat', chatRouter);

// cloudinary part
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
mongoose.connect(process.env.MONGODB_URL).then(
    () => {
        server.listen(process.env.PORT, () => {
            chatSocket(io)
            console.log(`port start ${process.env.PORT}`);
        })
    }
).catch(
    (error) => {
        console.log('db not connected', error);

    }
)

