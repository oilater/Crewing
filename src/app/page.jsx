"use client"

import css from './home.module.scss'
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import useUserStore from "../stores/users";
import useChatRequestStore from '@/stores/chat-requests';
import UserCard from "../components/UserCard/UserCard";
import RequestModal from '@/components/RequestModal/RequestModal';

const Home = () => {
    const { data } = useSession();
    const { connectSocket, disconnectSocket } = useSocket();
    // 접속한 모든 사용자 목록
    const userMap = useUserStore((state) => state.currentUserMap);
    userMap.delete(data?.user?.email); // 자신은 보여주지 않음
    const userList = Array.from(userMap.values());
    console.log(userList);
    // 사용자가 받은 채팅 요청
    const chatRequests = useChatRequestStore((state) => state.chatRequests);

    // 소켓 연결
    useEffect(() => {
        if (!data) return;
        connectSocket(data.user);

        return () => {
            disconnectSocket(data.user);
        }
    }, [data]);

    return (
        // 연결된 유저들의 프로필 카드
        <div>
            <div className={css.container}>
                <p className={css.boardTitle}>프로필을 눌러 대화할 수 있어요 💌</p>
                <div className={css.homeBoard}>
                    <div className={css.usersBoard}>
                        {userList &&
                            userList.map((user, index) => (
                                <UserCard key={index} user={user} />
                            ))
                        }
                    </div>
                </div>
            </div>

            {[...chatRequests].map((email, index) => (
                <div key={index} className={css.modalSection}>
                    <RequestModal fromUser={userMap.get(email)} />
                </div>
            ))}
        </div >
    );
};

export default Home;