import { create } from 'zustand';
import User from '@/models/User';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const useUserStore = create((set, get) => ({
    userMap: new Map(),
    currentUserMap: new Map(),

    // Firebase의 유저 정보 받아오기
    fetchUsers: async () => {
        const userMap = new Map();
        const querySnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_USERS_COLLECTION));

        querySnapshot.docs.forEach(doc => {
        const user = User.fromFirestore(doc);
        userMap.set(user.email, user);
        });
        
        set({ userMap });
    },

    // Firestore 유저 세팅 메서드
    setUser: (user) => {
        const newMap = new Map(get().userMap);
        newMap.set(user.email, user);

        set({ userMap: newMap });
    },

    getUser: (email) => {
        return get().userMap.get(email);
    },

    setUserMap: (newMap) => {
        set({ userMap: new Map(newMap) });
    },

    // 서비스 상에서 보여줄 유저 세팅 메서드
    setCurrentUser: (user) => {
        if (!user) return;
        const newMap = new Map(get().currentUserMap);
        newMap.set(user.email, user);
        set({ currentUserMap: newMap });
    },

    setCurrentUserMap: (newMap) => {
        set({ currentUserMap: new Map(newMap) });
    },

    getCurrentUser: (email) => {
        return get().currentUserMap.get(email);
    },

    removeCurrentUser: (email) => {
        const currentMap = new Map(get().currentUserMap);
        currentMap.delete(email);
        set({ currentUserMap: currentMap });
    }
}));

export default useUserStore;