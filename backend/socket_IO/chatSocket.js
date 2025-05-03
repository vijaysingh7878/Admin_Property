const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('join', (userId) => {
        });


        socket.on('sendMessage', (data) => {
            io.emit('receiveMessage', data);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

module.exports = chatSocket;
