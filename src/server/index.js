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

function getRoomId(senderEmail, recieverEmail) {
    return [senderEmail, recieverEmail].join('_');
}

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

    socket.on("requestChat", ({ reciever, sender }) => {
        const recieverSocketId = userMap.get(reciever.email)?.socketId;
        
        if (!recieverSocketId) return;
        io.to(recieverSocketId).emit("newRequest", sender);
    });

    socket.on("rejectChat", ({ sender, reciever }) => {
        const sentUser = userMap.get(sender.email);
        if (!sentUser) return;
        
        io.to(sentUser.socketId).emit("rejectNotification", {
            message: `${reciever.name}님이 채팅 요청을 거절했어요 😢`,
        });
    });

    socket.on("comfirmChat", ({ sender, reciever }) => {
        const senderSocketId = userMap.get(sender.email)?.socketId;
        const recieverSocketId = userMap.get(reciever.email)?.socketId;
        if (!senderSocketId || !recieverSocketId) return;
        
        const roomId = getRoomId(sender.email, reciever.email);

        io.to(senderSocketId).emit("match", {
            message: `${reciever.name}과 매칭되었어요🎉 \n 잠시 후 채팅방으로 이동합니다`,
            sender: sender,
            reciever: reciever,
            roomId: roomId
        });

        io.to(recieverSocketId).emit("match", {
            message: `${sender.name}과 매칭되었어요🎉 \n 잠시 후 채팅방으로 이동합니다`,
            sender: sender,
            reciever: reciever,
            roomId: roomId
        });
        
        setTimeout(() => {
            socket.join(roomId);
            const recieverSocket = io.sockets.sockets.get(recieverSocketId);
            const senderSocket = io.sockets.sockets.get(senderSocketId);
            if (!recieverSocket || !senderSocket) return;
            recieverSocket.join(roomId);
            senderSocket.join(roomId);
            io.to(roomId).emit("enterRoom", { message: '채팅방에 입장했어요. 매너 채팅하세요 !' });
        }, 3000);
    });

    // 소켓 연결이 종료되면
    socket.on("disconnect", () => {
        userMap.delete(email);
        const updatedUserList = Array.from(userMap.entries());
        io.emit("exitUser", updatedUserList);
    });
});

server.listen(port, () => {
    console.log("Listening ✅");
});