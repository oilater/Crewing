"use client"

import css from './home.module.scss'
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import useUserStore from "../stores/users";
import useChatRequestStore from '@/stores/chat-requests';
import UserCard from "../components/UserCard/UserCard";
import RequestModal from '@/components/RequestModal/RequestModal';
import Toast from '@/components/Toast/Toast';

const Home = () => {
    const { data } = useSession();
    const { connectSocket, disconnectSocket } = useSocket();
    const userMap = useUserStore((state) => state.currentUserMap); // 접속한 모든 사용자 목록
    userMap.delete(data?.user?.email); // 목록에서 자신은 보여주지 않음
    const userList = Array.from(userMap.values());
    const chatRequests = useChatRequestStore((state) => state.chatRequests); // 사용자가 받은 채팅 요청
    const requestMessage = useChatRequestStore((state) => state.requestMessage); // 상대 거절 메시지
    const rejectMessage = useChatRequestStore((state) => state.rejectMessage); // 상대 거절 메시지

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
                        {userList && userList.length > 0 ?
                            userList.map((user, index) => (
                                <UserCard key={index} user={user} />
                            )) :
                            <div className={css.noUser}>
                                <p>아직 대화 가능한 상대가 없어요 🥲</p>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* 채팅 요청 받으면 모달 생성 */}
            {[...chatRequests].map((email, index) => (
                <div key={index} className={css.modalSection}>
                    <RequestModal sender={userMap.get(email)} />
                </div>
            ))}

            {/* 상대방에게 채팅을 요청하면 Toast 생성 */}
            {requestMessage &&
                <div className={css.toastSection}>
                    <Toast message={requestMessage} />
                </div>
            }

            {/* 상대방이 채팅 거절하면 Toast 생성 */}
            {rejectMessage &&
                <div className={css.toastSection}>
                    <Toast message={rejectMessage} />
                </div>
            }
        </div >
    );
};

export default Home;