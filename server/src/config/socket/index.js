const { CLIENT_PORT } = require('../env');
const { Server } = require('socket.io');
const userSocket = require('./UserSocket');
const postSocket = require('./PostSocket');
const cateSocket = require('./CateSocket');
const newsSocket = require('./NewsSocket');
const documentsSocket = require('./DocumentSocket');
const favouriteSocket = require('./FavouriteSocket');

function configureWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: `http://localhost:${CLIENT_PORT}`,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true,
        },
    });

    console.log('WebSocket server đã khởi động');
    userSocket(io);
    postSocket(io);
    cateSocket(io);
    newsSocket(io);
    documentsSocket(io);
    favouriteSocket(io);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('Hi server', () => {
            console.log('Received Hi server');
            socket.emit('message', 'Hello from the server');
        });
        socket.on('send_message', (message) => {
            console.log('Received message:', message);
            io.emit('recieve_message', `Server received: ${message}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

module.exports = configureWebSocket;
