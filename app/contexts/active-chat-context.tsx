import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

import Conversation from "~/types/conversation";

interface ActiveConversationType {
    selectedConversation: Conversation | null;
    setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>;
}

const ActiveConversationContext = createContext<ActiveConversationType | undefined>(undefined);

export const ActiveConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
    return (
      <ActiveConversationContext.Provider value={{ selectedConversation, setSelectedConversation }}>
        {children}
      </ActiveConversationContext.Provider>
    );
};

export const useActiveConversation = () => {
    const context = useContext(ActiveConversationContext);
    if (!context) {
      throw new Error("useConversation must be used within a ChatProvider");
    }
    return context;
}