import axios from "axios";

import Conversation from "~/types/conversation";
import DirectMessage from "~/types/direct-message";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is not defined');
}

const generateMessages = (count: number): Conversation => {
    const conversationId = "cm8d0o2nj000eok34dhh9x9gx";
    const userId1 = "cm8cxsw6v0000okrpkf9vdxj5";
    const userId2 = "cm8d0hn050006ok34t4wljlix";

    const randomMessage = () => {
        const messages = [
          "Hey! How's it going?",
          "I'm good. Just working on some code.",
          "Nice! What are you building?",
          "A chat app with real-time features.",
          "Oh cool! WebSockets?",
          "Yep, using Socket.IO for real-time messaging.",
          "How are you handling authentication?",
          "Using JWTs and Clerk for auth.",
          "That sounds solid. Are you deploying on Vercel?",
          "Yeah, it's easy to deploy Next.js apps there.",
          "What about the database?",
          "Using Prisma with Planetscale. Super smooth!",
          "Sweet! Btw, did you see the new React update?",
          "Yeah! Server components are kinda tricky though.",
          "True, but they make data fetching cleaner.",
          "Gotta try them soon. How's your project going?",
          "Good! Just polishing the UI now.",
          "Nice! Using Tailwind?",
          "Of course! Tailwind makes everything easier. Thanks for the tip. How about webRTC?.",
          "Haha, true! Need any help?",
          "Maybe with WebRTC. Video calls are tricky. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, eum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, eum. Maybe with WebRTC. Video calls are tricky. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, eum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, eum. Maybe with WebRTC. Video calls are tricky. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, eum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, eum.",
          "For sure! Hit me up anytime.",
          "Thanks, man! Appreciate it.",
          "No problem! Gotta go now. Talk later?",
          "Yep! Catch you later.",
          "Bye!",
          "See ya!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const messages: DirectMessage[] = Array.from({ length: count }, (_, index): DirectMessage => {
        const senderId = index % 2 === 0 ? userId1 : userId2;
        const receiverId = senderId === userId1 ? userId2 : userId1;

        return {
            id: `cm8d0o2nj000eok34dhh9x9gx-${index}`,
            content: randomMessage(),
            senderId,
            receiverId,
            conversationId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })

    return {
        id: conversationId,
        participant: { id: userId1, username: "John Doe", email: "1j8mF@example.com", createdAt: new Date(), updatedAt: new Date() },
        createdAt: new Date(),
        lastMessageId: messages[messages.length - 1].id,
        lastMessage: messages[messages.length - 1],
        messages
    }

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

export const getMessages = async (conversationId: string, accessToken: string): Promise<Conversation> => {
    console.log('Fetching messages for conversation:', conversationId, "with token:", accessToken);
    const fakeMessages = generateMessages(50);

    return fakeMessages;
}