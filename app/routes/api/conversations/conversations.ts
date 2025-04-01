import { LoaderFunction } from "react-router";

import { commitSession, getSession } from "~/session.server";
import { getUserConversations } from "~/utils/api.server";
import authenticate from "~/utils/authenticate.server";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is not defined');
}

export const loader: LoaderFunction = async ({ request }) => {
    console.log('(/api/chats)Fetching user conversations...');
    const session = await getSession(request);
    try {
        const accessToken = await authenticate(request, session, true);
        const conversations = await getUserConversations(accessToken);

        console.log('(client)Conversations:', conversations);

        return Response.json(conversations, {
            headers: {
                'Set-Cookie': await commitSession(session),
            }
        });
    } catch (error) {
        console.error('Error fetching user chats:', error);

        return Response.json({ error: 'Failed to fetch user chats' }, { status: 500 });
    }
}