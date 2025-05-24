"use client"

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import User from "../models/User";


export function useUsers() {
  const [users, setUsers] = useState(new Map());
  
  useEffect(() => {
    const fetchUsers = async () => {
      const userMap = new Map();
      const querySnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_USERS_COLLECTION));

      querySnapshot.docs.forEach(doc => {
        const user = User.fromFirestore(doc);
        userMap.set(user.email, user);
      });

      setUsers(userMap);
    };

    fetchUsers();
  }, []);

  return { users };
}