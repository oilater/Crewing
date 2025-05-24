"use client"

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import User from "../models/User";

export function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => User.fromFirestore(doc));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  return { users };
}