import axios from "axios";

import Conversation from "~/types/conversation";
import DirectMessage from "~/types/direct-message";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is not defined');
}

export const getUser = async (accessToken: string) => {
    const response = await axios.get(`${BACKEND_URL}/users/me`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })

    console.log('(server)User:', response.data);

    return response.data;
}

export const getUserConversations= async (accessToken: string) => {
    const response = await axios.get(`${BACKEND_URL}/conversations/all`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })

    console.log('(server)Conversations:', response.data);

    return response.data;
}

export const getMessages = async (conversationId: string, accessToken: string, cursor?: string, limit?: string): Promise<DirectMessage[]> => {
    console.log('Fetching messages for conversation:', conversationId, "with token:", accessToken);

    const queryParams = new URLSearchParams();
    if (cursor) {
        queryParams.set('cursor', cursor);
    }
    if (limit) {
        queryParams.set('take', limit);
    }

    const response = await axios.get(`${BACKEND_URL}/conversations/${conversationId}/messages?${queryParams.toString()}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    })

    console.log('(server)Messages:', response.data);

    return response.data;
}