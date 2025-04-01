import { LoaderFunction, redirect } from "react-router";

import { commitSession, destroySession, getSession } from "~/session.server";
import authenticate from "~/utils/authenticate.server";

export const loader: LoaderFunction = async ({ request }) => {
    console.log('(/api/refresh-token)Refreshing token...');
    const session = await getSession(request);
    try {
        const accessToken = await authenticate(request, session, true);

        return Response.json({ accessToken }, {
            headers: {
                'Set-Cookie': await commitSession(session),
            }
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return redirect('/sign-in', {
            headers: { 'Set-Cookie': await destroySession(session) },
        });
    }
}