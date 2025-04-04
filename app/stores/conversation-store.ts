import { createStore, useStore } from 'zustand';

interface ConversationState {
    newMessageCount: number;
    isAutoScroll: boolean;
    incrementNewMessageCount: () => void;
    resetNewMessageCount: () => void;
    setIsAutoScroll: (isAutoScroll: boolean) => void;
}

export const createConversationStore = () => {
    const store = createStore<ConversationState>((set) => ({
        newMessageCount: 0,
        isAutoScroll: true,
        incrementNewMessageCount: () =>
            set((state) => ({
                newMessageCount: state.newMessageCount + 1,
            })),
        resetNewMessageCount: () => set({ newMessageCount: 0 }),
        setIsAutoScroll: (isAutoScroll) => set({ isAutoScroll }),
    }));

    const useConversation = <T>(selector: (state: ConversationState) => T) => 
        useStore(store, selector);

    return { store, useConversation };
};

export type ConversationStore = ReturnType<typeof createConversationStore>;
