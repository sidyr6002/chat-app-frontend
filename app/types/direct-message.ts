interface DirectMessage {
    id: string;
    content: string;

    senderId: string;
    receiverId: string;
    conversationId: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface DirectMessageResponse {
    messages: DirectMessage[];
    nextCursor: string | null;
}

export default DirectMessage