import { useState } from "react";
import { io } from "socket.io-client";
import useUserStore from "../stores/users";
import useChatRequestStore from "../stores/chat-requests";
import { useSession } from "next-auth/react";

let socket = null;

export function useSocket() {
    const [connected, setConnected] = useState(false);
    const setCurrentUserMap = useUserStore((state) => state.setCurrentUserMap);
    const removeCurrentUser = useUserStore((state) => state.removeCurrentUser);
    const setChatRequests = useChatRequestStore((state) => state.setChatRequests);
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
            transports: ["websocket", "polling"],
        });
        
        // 서버와 연결되면
        socket.on("connect", () => {
            setConnected(true);
        });

        /** 새로운 유저가 소켓에 연결되면, 서버가 모든 유저에게 해당 유저의 정보를 보내며, 이 유저는 currentUserMap에 추가됨 */
        const updateUsers = (data) => {
            setCurrentUserMap(new Map(data));
        };

        socket.on("newUser", updateUsers);
        socket.on("exitUser", updateUsers);
        
        socket.on("newRequest", (fromUser) => {
            if (!fromUser) return;
            setChatRequests(fromUser.email);
        });

        // 연결이 끊어지면
        socket.on("disconnect", () => {
            setConnected(false);
            removeCurrentUser(data?.email);
        });
        }
    };

    /** 프로필을 눌러 채팅을 요청 */
    const requestChat = (targetEmail) => {
        if (!socket || !data || !data.user) return;
        
        socket.emit("requestChat", {
            toUserEmail: targetEmail,
            fromUser: data.user,
        });
    }

    /** 서버와 연결 끊기 */
    const disconnectSocket = (user) => {
        if (!socket) return;

        socket.disconnect();
        socket = null;
        setConnected(false);
        removeCurrentUser(user.email);
    };

    return { socket, connected, connectSocket, requestChat, disconnectSocket};
}