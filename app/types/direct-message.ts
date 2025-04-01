interface DirectMessage {
    id: string;
    content: string;

    senderId: string;
    receiverId: string;
    conversationId: string;

    createdAt: Date;
    updatedAt: Date;
}

export default DirectMessage