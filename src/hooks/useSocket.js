import { useState, useRef } from "react";
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
    const removeChatRequest = useChatRequestStore((state) => state.removeChatRequest);
    // Toast 메시지 세팅
    const setRequestMessage = useChatRequestStore((state) => state.setRequestMessage);
    const setRejectMessage = useChatRequestStore((state) => state.setRejectMessage);
    const rejectTimerRef = useRef(null);
    const requestTimerRef = useRef(null);

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
        
        // 채팅 요청을 받으면
        socket.on("newRequest", (sender) => {
            if (!sender) return;
            setChatRequests(sender.email);
        });

        // 상대가 채팅 요청을 거절하면, 보낸 사람에게도 알려줌
        socket.on("rejectNotification", (data) => {
            if (!data) return;
            setRejectMessage(data.message);
            
            if (rejectTimerRef.current) {
                clearTimeout(rejectTimerRef.current);
            }

            rejectTimerRef.current = setTimeout(() => {
                setRejectMessage("");
            }, 2000);
        });

        // 연결이 끊어지면
        socket.on("disconnect", () => {
            setConnected(false);
            removeCurrentUser(data?.email);
        });
        }
    };

    /** 프로필을 눌러 채팅을 요청할 때 */
    const onRequestChat = (reciever) => {
        if (!socket || !data || !data.user || !reciever) return;
        
        socket.emit("requestChat", {
            reciever: reciever,
            sender: data.user,
        });

        setRequestMessage(`${reciever.name}님에게 채팅을 요청했어요 😀`);
        
        if (requestTimerRef.current) {
            clearTimeout(requestTimerRef.current);
        }

        requestTimerRef.current = setTimeout(() => {
            setRequestMessage("");
        }, 2000);
    }

    /** 채팅 요청 수락 */
    const onConfirmChat = (sender, reciever) => {
        if (!socket || !sender || !reciever) return;
        removeChatRequest(sender.email);
        socket.emit("comfirmChat", { sender: sender, reciever: reciever });
    }

    /** 채팅 요청 거절 */
    const onRejectChat = (sender, reciever) => {        
        removeChatRequest(sender.email);
        socket.emit("rejectChat", { sender: sender, reciever: reciever });
    }

    /** 서버와 연결 끊기 */
    const disconnectSocket = (user) => {
        if (!socket) return;

        socket.disconnect();
        socket = null;
        setConnected(false);
        removeCurrentUser(user.email);
    };

    return { socket, connected, connectSocket, onRequestChat, onRejectChat, onConfirmChat, disconnectSocket};
}