import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export function useSocket() {
    const [connected, setConnected] = useState(false);
    const [connectCount, setConnectCount] = useState(0);

    useEffect(() => {
        socket.on("connect", () => {
            setConnected(true);
        });

        socket.on("updateUserCount", () => {
            setConnectCount(connectCount + 1);
        });

        return () => {
            socket.disconnect();
            socket.off("updateUserCount");
        };
    }, []);

    return { socket, connected, connectCount };
}