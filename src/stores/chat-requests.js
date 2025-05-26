import { create } from 'zustand';

const useChatRequestStore = create((set, get) => ({
    chatRequests: new Set(),
    rejectMessage: "",
    requestMessage: "",

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
    },

    setRequestMessage: (message) => {
        set({requestMessage: message});
    },

    setRejectMessage: (message) => {
        set({rejectMessage: message});
    },
}));

export default useChatRequestStore;