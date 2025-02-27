import Chat from "~/types/chat";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is not defined');
}

export const getUserChats = async () => {
    const mockChats: Chat[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        userImage: `https://randomuser.me/api/portraits/thumb/${i % 2 === 0 ? 'men' : 'women'
            }/${i % 50}.jpg`,
        name: `User ${i + 1}`,
        message: `Message from User ${i + 1}, lerom aadrhfnm agajd egjegfa djagdygabdbjagdgajbd ahsdjadh`,
    }));

    return mockChats;
}