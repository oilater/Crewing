"use client"

import css from './RequestModal.module.scss';
import Image from "next/image";
import { useSocket } from '@/hooks/useSocket';
import { useSession } from "next-auth/react";


const RequestModal = ({ sender }) => {
    const { onRejectChat, onConfirmChat } = useSocket();
    const { data } = useSession();
    if (!sender) return null;

    /** 거절 버튼을 누르면 */
    const onCancel = (e, sender) => {
        e.preventDefault();
        if (!data || !data.user) return;
        onRejectChat(sender, data.user);
    }

    /** 수락 버튼을 누르면 */
    const onConfirm = (e, sender) => {
        e.preventDefault();
        if (!data || !data.user) return;
        // 수락한 유저의 정보를 보냄
        onConfirmChat(sender, data.user);
    }

    return (
        <div className={css.wrapper}>
            <p className={css.title}><span>{sender.name}</span>님이 대화를 요청했어요 👋</p>
            <div className={css.imageWrapper}>
                <Image
                    width={150}
                    height={150}
                    className={css.userCardImage}
                    src={sender.imageUrl}
                    alt="유저 프로필 사진"
                    priority={true}
                />
            </div>
            <div className={css.buttonSection}>
                <div className={css.buttonWrapper}>
                    <button className={css.cancelButton} onClick={(e) => onCancel(e, sender)}>거절하기</button>
                </div>
                <div className={css.buttonWrapper}>
                    <button className={css.confirmButton} onClick={(e) => onConfirm(e, sender)}>수락하기</button>
                </div>
            </div>
        </div>
    );

}

export default RequestModal;
