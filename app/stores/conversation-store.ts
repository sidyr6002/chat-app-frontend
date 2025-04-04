import { createStore, useStore } from 'zustand';

interface ConversationState {
    newMessageCount: number;
    isAutoScroll: boolean;
    actions: {
        incrementNewMessageCount: () => void;
        resetNewMessageCount: () => void;
        setIsAutoScroll: (isAutoScroll: boolean) => void;
    };
}

export const createConversationStore = () => {
    const store = createStore<ConversationState>((set) => ({
        newMessageCount: 0,
        isAutoScroll: true,
        actions: {
            incrementNewMessageCount: () => set((state) => ({
                newMessageCount: state.newMessageCount + 1
            })),
            resetNewMessageCount: () => set({ newMessageCount: 0 }),
            setIsAutoScroll: (isAutoScroll) => set({ isAutoScroll }),
        },
    }));

    const useConversation = {
        useNewMessageCount: () => useStore(store, (s) => s.newMessageCount),
        useIsAutoScroll: () => useStore(store, (s) => s.isAutoScroll),
        useActions: () => useStore(store, (s) => s.actions)
    };

    return { store, useConversation };
};

export type ConversationStore = ReturnType<typeof createConversationStore>;
