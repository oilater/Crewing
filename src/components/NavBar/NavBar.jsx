"use client"

import css from './NavBar.module.scss';
import Image from "next/image";
import logoImage from '../../../public/images/app_logo.png';
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const NavBar = () => {
    const pathname = usePathname();
    const { data } = useSession();

    if (!data || pathname === process.env.NEXT_PUBLIC_LOGIN_PATH) return null;

    const myProfileImage = data.user.image || logoImage;

    return (
        <div className={css.navWrapper}>
            <div className={css.container}>
                <div className={css.titleSection}>
                    <div className={css.logoSection}>
                        <Image
                            width={40}
                            height={40}
                            src={logoImage}
                            alt="로고 이미지"
                            priority={true}
                        />
                        <p>Crewing</p>
                    </div>
                    <div className={css.profileSection}>
                        <Image
                            width={40}
                            height={40}
                            className={css.myProfileImg}
                            src={myProfileImage}
                            alt="내 프로필 이미지"
                            priority={true}
                        />
                        <p className={css.welcomeLabel}><span>{data.user.name}</span></p>
                        <button className={css.logOutBtn} onClick={() => signOut()}>로그아웃</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;