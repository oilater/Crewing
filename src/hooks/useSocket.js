import { useState } from "react";
import { io } from "socket.io-client";
import useUserStore from "../stores/users";
import User from "@/models/User";
import { useSession } from "next-auth/react";

let socket = null;

export function useSocket() {
    const [connected, setConnected] = useState(false);
    const setCurrentUserMap = useUserStore((state) => state.setCurrentUserMap);
    const removeCurrentUser = useUserStore((state) => state.removeCurrentUser);
    const { data } = useSession();
    
    /** 소켓 서버와 연결 (카카오로부터 받은 유저의 데이터를 함께 넘김) */
    const connectSocket = (user) => {
        if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            auth: {
                email: user.email,
                name: user.name,
                imageUrl: user.image,
            },
        });
        
        // 서버와 연결되면
        socket.on("connect", () => {
            setConnected(true);
        });

        const updateUserMap = (data) => {
            setCurrentUserMap(new Map(data));
        };

        // 새로운 유저가 소켓에 연결되면, 서버가 모든 유저에게 해당 유저의 정보를 보내며 이 유저는 currentUserMap에 추가됨
        socket.on("newUser", updateUserMap);
        socket.on("exitUser", updateUserMap);

        // 연결이 끊어지면
        socket.on("disconnect", () => {
            setConnected(false);
            removeCurrentUser(data?.email);
        });
        }
    };

    const createPrivateRoom = (targetEmail) => {
        if (!data) return;
        socket.emit("createPrivateRoom", {
            fromUserId: data.user?.email,
            toUserId: targetEmail,
        });
    }

    // 서버와 연결 끊기
    const disconnectSocket = (user) => {
        if (!socket) return;

        socket.disconnect();
        socket = null;
        setConnected(false);
        removeCurrentUser(user.email);
    };

    return { socket, connected, connectSocket, createPrivateRoom, disconnectSocket};
}