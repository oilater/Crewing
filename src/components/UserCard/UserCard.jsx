import css from './UserCard.module.scss';
import Image from "next/image";
import { useSocket } from '@/hooks/useSocket';

const UserCard = ({ user }) => {
    const { requestChat } = useSocket();
    if (!user) return null;

    const onClickCard = (e, email) => {
        e.preventDefault();
        requestChat(email);
    }

    return (
        <div className={css.cardContainer}>
            <button className={css.cardWrapperButton} onClick={(e) => onClickCard(e, user.email)}>
                <div className={css.imageWrapper}>
                    <Image
                        width={150}
                        height={150}
                        className={css.userCardImage}
                        src={user.imageUrl}
                        alt="유저 프로필 사진"
                        priority={true}
                    />
                </div>
                <p>{user.name}</p>
            </button>
        </div>
    );
};

export default UserCard;