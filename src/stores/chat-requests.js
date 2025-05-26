import { create } from 'zustand';

const useChatRequestStore = create((set, get) => ({
    chatRequests: new Set(),

    setChatRequests: (email) => {
        if (!email) return;
        const newSet = new Set(get().chatRequests);
        newSet.add(email);
        set({chatRequests: newSet});
    },

    removeChatRequest: (email) => {
        if (!email) return;
        const newSet = new Set(get().chatRequests);
        newSet.delete(email);
        set({chatRequests: newSet});
    }
}));

export default useChatRequestStore;