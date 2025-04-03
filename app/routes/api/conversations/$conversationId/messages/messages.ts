import { LoaderFunction } from "react-router";

import { commitSession, getSession } from "~/session.server";
import { getMessages } from "~/utils/api.server";
import authenticate from "~/utils/authenticate.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    console.log('(/api/conversations/:conversationId/messages)Fetching conversation...');

    const session = await getSession(request);
    try {
        const accessToken = await authenticate(request, session, true);
        const { conversationId } = params;

        if (!conversationId) {
            return Response.json({ error: 'Invalid conversation ID' }, { status: 400 });
        }

        const url = new URL(request.url);
        const cursor = url.searchParams.get('cursor') || undefined;
        const limit = url.searchParams.get('limit') || "10";

        console.log('cursor:', cursor);
        console.log('limit:', limit);

        const messages = await getMessages(conversationId, accessToken, cursor, limit);

        return Response.json(messages, {
            headers: {
                'Set-Cookie': await commitSession(session),
            }
        });
        
    } catch (error) {
        console.error('Error fetching conversation messages:', error);

        return Response.json({ error: 'Failed to fetch conversation messages' }, { status: 500 });
    }
   
}