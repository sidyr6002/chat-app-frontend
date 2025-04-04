import { create } from 'zustand';

import { ConversationStore, createConversationStore } from '../conversation-store';

interface ConversationManagerState {
  conversationStores: Map<string, ConversationStore>;
  getOrCreateStore: (conversationId: string) => ConversationStore;
  removeStore: (conversationId: string) => void;
}

export const useConversationManager = create<ConversationManagerState>((set, get) => ({
    conversationStores: new Map(),
    
    getOrCreateStore: (conversationId) => {
      const { conversationStores } = get();
      
      if (!conversationStores.has(conversationId)) {
        const newStore = createConversationStore();
        conversationStores.set(conversationId, newStore);
        set({ conversationStores: new Map(conversationStores) });
      }
      
      return conversationStores.get(conversationId)!;
    },
    
    removeStore: (conversationId) => {
      const { conversationStores } = get();
      conversationStores.delete(conversationId);
      set({ conversationStores: new Map(conversationStores) });
    }
  }));