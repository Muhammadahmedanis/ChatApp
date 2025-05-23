import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2],
        methods: ["GET", 'POST', 'DELETE', 'PUT'],
        credentials: true
    }
});

export const getRecipientSocketId = (recipientId) => userSocketMap[recipientId];

const userSocketMap =  {}

io.on('connection', (socket) => {
    console.log("User connected:", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId != 'undefined') userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


export { io, server, app }