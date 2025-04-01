import { getSession } from "~/session.server"

export const getAccessToken = async (request: Request) => {
    const session = await getSession(request);
    const accessToken = session.get('accessToken');

    if (!accessToken) {
        throw Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return accessToken; 
}