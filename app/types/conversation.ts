import DirectMessage from "./direct-message";
import User from "./user";

interface Conversation {
    id: string;
    createdAt: Date;
    lastMessageId: string | null;
    lastMessage: DirectMessage | null;
    participant: User;
    messages: DirectMessage[];
};

export default Conversation