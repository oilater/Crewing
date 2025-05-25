import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
// 소켓 서버가 실행될 포트
const port = process.env.NEXT_PUBLIC_SOCKET_PORT || 4000;

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
});

const userMap = new Map();

// 새로운 유저가 연결되면
io.on("connection", (socket) => {
    // 유저의 데이터
    const { email, name, imageUrl } = socket.handshake.auth;
    // 유저의 소켓 id
    const socketId = socket.id;
    if (!email || !name || !imageUrl) return;
    
    if (!userMap.has(email)) {
        userMap.set(email, { socketId, email, name, imageUrl });
    }

    const userList = Array.from(userMap.entries()); 
    // "newUser" 이벤트로 모든 클라이언트에게 보내줌
    io.emit("newUser", userList);

    // 유저 연결이 종료되면
    socket.on("disconnect", () => {
        userMap.delete(email);
        const updatedUserList = Array.from(userMap.entries());
        io.emit("exitUser", updatedUserList);
    });
});

server.listen(port, () => {
    console.log("Listening ✅");
});