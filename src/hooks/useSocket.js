import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export function useSocket() {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            setConnected(true);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { socket, connected };
}