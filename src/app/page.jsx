"use client"

import css from './home.module.scss'
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import useUserStore from "../stores/users";
import UserCard from "../components/UserCard/UserCard";

const Home = () => {
    const { data } = useSession();
    const { connectSocket, disconnectSocket } = useSocket();
    const userMap = useUserStore((state) => state.currentUserMap);
    userMap.delete(data?.user?.email); // 자신은 보여주지 않음
    const currentUserList = Array.from(userMap.values());
    console.log(currentUserList);

    useEffect(() => {
        if (!data) return;
        connectSocket(data.user);

        return () => {
            disconnectSocket(data.user);
        }
    }, [data]);

    return (
        // 연결된 유저들의 프로필 카드가 보임
        <div className={css.container}>
            <p className={css.boardTitle}>프로필을 눌러 대화할 수 있어요 💌</p>
            <div className={css.homeBoard}>
                <div className={css.usersBoard}>
                    {currentUserList &&
                        currentUserList.map((user, index) => (
                            <UserCard key={index} user={user} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Home;