"use client"

import {useUsers} from "../viewmodels/user-view-model";

const Home = () => {
  const { users } = useUsers();

  return (
    <div>
        <>
          <p>{users[0]?.name}</p>
          <p>{users[0]?.age}</p>
        </>
    </div>
  );
};

export default Home;