"use client"

import css from './common.module.scss';
import { useSocket } from "@/hooks/useSocket";
import {useUsers} from "../viewmodels/user-view-model";
import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
  const { users } = useUsers();
  const { data, status } = useSession();
  const { connected, connectCount } = useSocket();

  return (
    <div className={css.container}>
      <div className={css.titleSection}>
        <span>{data?.user?.name}님 환영합니다!</span>
         <button type="kakao" onClick={() => signOut()}>로그아웃</button>
      </div>
    </div>
  );
};

export default Home;