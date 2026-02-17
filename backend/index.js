require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app.js');
const port = process.env.PORT || 3000

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    },
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join_chat', (chatId) => {
        const roomName = `chat_${chatId}`;


        socket.rooms.forEach(room => {
            if (room !== socket.id) {
                socket.leave(room);
            console.log(`Socket ${socket.id} has left room ${room}`);

            }
        });

        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${chatId}`);

        const clients = io.sockets.adapter.rooms.get(roomName);
        const count = clients ? clients.size : 0;

        io.to(roomName).emit('online_count', count);
    });

    


    socket.on('send_message', (msg) => {

        const roomName = `chat_${msg.chatId}`;

        io.to(roomName).emit('receive_message', msg);
    });

    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => {
            if (room.startsWith('chat_')) {

                const clients = io.sockets.adapter.rooms.get(room);
                const count = clients ? clients.size -1 : 0;

                io.to(room).emit('online_count', count);
            }
        })
        console.log(`Client disconnected: ${socket.id}`);
    });
});


server.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})