import { LoaderFunction, redirect } from 'react-router';

import { commitSession, destroySession, getSession } from '~/session.server';
import { getUser } from '~/utils/api.server';
import authenticate from '~/utils/authenticate.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    try {
        const accessToken = await authenticate(request, session, true);
        const user = await getUser(accessToken);

        return Response.json(user, {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return redirect('/sign-in', {
            headers: { 'Set-Cookie': await destroySession(session) },
        });
    }
};
