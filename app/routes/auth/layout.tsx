import { LoaderFunction, Outlet, redirect } from 'react-router';

import { getSession } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    const accessToken = session.get('accessToken');

    if (accessToken) {
        return redirect('/chat');
    }
};

const AuthLayout = () => {
    return (
        <div className="h-screen flex justify-center items-center p-4 sm:p-6 bg-neutral-800">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
