"use client"

import css from './RequestModal.module.scss';
import Image from "next/image";
import useChatRequestStore from '@/stores/chat-requests';

const RequestModal = ({ fromUser }) => {
    if (!fromUser) return null;
    const removeChatRequest = useChatRequestStore((state) => state.removeChatRequest);

    const onCancel = (e, fromUser) => {
        e.preventDefault();
        removeChatRequest(fromUser.email);
    }

    const onConfirm = (e) => {
        e.preventDefault();
    }

    return (
        <div className={css.wrapper}>
            <p className={css.title}><span>{fromUser.name}</span>님이 대화를 요청했어요 👋</p>
            <div className={css.imageWrapper}>
                <Image
                    width={150}
                    height={150}
                    className={css.userCardImage}
                    src={fromUser.imageUrl}
                    alt="유저 프로필 사진"
                    priority={true}
                />
            </div>
            <div className={css.buttonSection}>
                <div className={css.buttonWrapper}>
                    <button className={css.cancelButton} onClick={(e) => onCancel(e, fromUser)}>거절하기</button>
                </div>
                <div className={css.buttonWrapper}>
                    <button className={css.confirmButton} onClick={onConfirm}>수락하기</button>
                </div>
            </div>
        </div>
    );

}

export default RequestModal;
