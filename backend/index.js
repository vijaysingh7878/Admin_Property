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
const server = express();
const http = require('http');
const { Server } = require('socket.io');
const chatRouter = require('./router/chatRouter');
const chatSocket = require('./socket_IO/chatSocket');
const app = http.createServer(server);

const io = new Server(app, {
    cors: {
        origin: process.env.NEXT_PUBLIC_BASE_URL
    }
})

server.use(cors(
    {
        origin: [process.env.NEXT_PUBLIC_BASE_URL]
    }
))

server.use(express.json())
server.use('/property', propertyRouter);
server.use('/user', userRouter);
server.use('/agent', agentRouter);
server.use('/admin', adminRouter);
server.use('/blog', blogRouter);
server.use('/req', reqRouter);
server.use('/chat', chatRouter);

// cloudinary part
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
mongoose.connect(process.env.MONGODB_URL).then(
    () => {
        app.listen(process.env.PORT, () => {
            chatSocket(io)
            console.log(`port start ${process.env.PORT}`);
        })
    }
).catch(
    (error) => {
        console.log('db not connected', error);

    }
)

