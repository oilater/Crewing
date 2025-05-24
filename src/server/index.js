import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = process.env.NEXT_PUBLIC_SOCKET_PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // 클라이언트가 연결되면
  io.emit("updateUserCount");
  
});

server.listen(port, () => {
  console.log("Listening");
});