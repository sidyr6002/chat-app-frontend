import { LoaderFunction } from "react-router";

import { getMessages } from "~/utils/api.server";

export const loader: LoaderFunction = async ({ params }) => {
    console.log('(/api/conversations/:conversationId)Fetching conversation...');
    const conversationId = params.conversationId;

    if (!conversationId) {
        return Response.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

    const conversation = await getMessages(conversationId, '');

    return Response.json(conversation);
}