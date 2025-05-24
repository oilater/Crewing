"use client"

import { useSocket } from "@/hooks/useSocket";
import { useUsers } from "../viewmodels/user-view-model";
import { useSession } from "next-auth/react";

const Home = () => {
    const { users } = useUsers();
    const { data, status } = useSession();
    const { connected, connectCount } = useSocket();
    console.log(users);

    return (
        <div>

        </div>
    );
};

export default Home;