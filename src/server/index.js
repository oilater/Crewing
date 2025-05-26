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

function getRoomId(email1, email2) {
    return [email1, email2].join('_');
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

        // const roomId = getRoomId(fromUser.email, toUserEmail);
        // socket.join(roomId);

        // 상대에게 "새로운 메시지" 이벤트 전달 - 요청 보낸 유저 정보를 같이 보냄
            // 서버 측에서 상대방 소켓을 직접 방에 입장시킴
            // const targetSocket = io.sockets.sockets.get(targetSocketId);
            // targetSocket?.join(roomId);
        // 본인에게도 방 정보 전달
        // socket.emit("joinRoom", { roomId, toUserEmail,});
    });

    socket.on("rejectChat", ({ sender, reciever }) => {
        const sentUser = userMap.get(sender.email);
        if (!sentUser) return;
        
        io.to(sentUser.socketId).emit("rejectNotification", {
            message: `${reciever.name}님이 채팅 요청을 거절했어요 😢`,
        });
    });

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