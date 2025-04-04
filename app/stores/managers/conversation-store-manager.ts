import { create } from 'zustand';

import { ConversationStore, createConversationStore } from '../conversation-store'

const conversationStores = new Map<string, ConversationStore>();

interface ConversationManagerState {
  getStore: (conversationId: string) => ConversationStore['store'];
  getHook: (conversationId: string) => ConversationStore['useConversation'];
  removeStore: (conversationId: string) => void;
}

export const useConversationManager = create<ConversationManagerState>(() => ({
    getStore: (conversationId) => {
      if (!conversationStores.has(conversationId)) {
        const newStore = createConversationStore();
        conversationStores.set(conversationId, newStore);
      }
      return conversationStores.get(conversationId)!.store;
    },

    getHook: (conversationId) => {
      if (!conversationStores.has(conversationId)) {
        const newStore = createConversationStore();
        conversationStores.set(conversationId, newStore);
      }
      return conversationStores.get(conversationId)!.useConversation;
    },
    
    removeStore: (conversationId) => {
      conversationStores.delete(conversationId);
    }
  }));