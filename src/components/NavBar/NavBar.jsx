"use client"

import css from './NavBar.module.scss';
import { useUsers } from "../../viewmodels/user-view-model";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logoImage from '../../../public/images/app_logo.png';

const NavBar = () => {
    const pathname = usePathname();
    const { users } = useUsers();
    const { data } = useSession();
    const myProfileImage = users.get(data?.user.email)?.imageUrl || logoImage;
    console.log(users);

    if (pathname === process.env.NEXT_PUBLIC_LOGIN_PATH) return null;

    return (
        <div className={css.container}>
            <div className={css.titleSection}>
                <Image
                    width={40}
                    height={40}
                    className={css.myProfileImg}
                    src={myProfileImage}
                    alt="내 프로필 이미지"
                    priority={true}
                />
                <p className={css.welcomeLabel}><span>성현</span>님 👋</p>
                <button className={css.logOutBtn} onClick={() => signOut()}>로그아웃</button>
            </div>
        </div>
    );
};

export default NavBar;