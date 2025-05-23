"use client"

import { useSocket } from "@/hooks/useSocket";
import {useUsers} from "../viewmodels/user-view-model";

const Home = () => {
  const { users } = useUsers();
  const { connected } = useSocket();

  return (
    <div>{connected ? "소켓 연결됨" : "연결 대기 중"}</div>
  );
};

export default Home;