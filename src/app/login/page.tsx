"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import kakaoImage from '../../../public/images/kakao_login.png';
import logoImage from '../../../public/images/app_logo.png';
import css from './login.module.scss';

const LoginPage = () => {
    return (
        <div className={css.loginPage}>
            <div className={css.appTitle}>
                <p>운동 친구 만들기 <span>크루잉</span></p>
            </div>
            <Image
                className={css.logoImage}
                src={logoImage}
                alt="앱 로고 이미지"
                priority={true}
            />
            <button className={css.loginContainer} onClick={() => signIn("kakao")}>
                <Image
                    className={css.loginBtn}
                    src={kakaoImage}
                    alt="카카오 로그인 버튼 이미지"
                    priority={true}
                />
            </button>
        </div>
    );
}

export default LoginPage;