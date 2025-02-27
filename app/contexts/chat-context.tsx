import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

import Chat from "~/types/chat";

interface ChatContextType {
    selectedChat: Chat | null;
    setSelectedChat: Dispatch<SetStateAction<Chat | null>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  
    return (
      <ChatContext.Provider value={{ selectedChat, setSelectedChat }}>
        {children}
      </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
      throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}