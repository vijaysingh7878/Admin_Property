const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User joined room: ${userId}`);
        });

        socket.on('sendMessage', (data) => {
            const { receiverId } = data;
            
            io.to(receiverId).emit('receiveMessage', data);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

module.exports = chatSocket;
