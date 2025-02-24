import { LoaderFunction, Outlet } from "react-router"

import { getSession } from "~/session.server";
import authenticate from "~/utils/autheticate";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    
    const accessToken = await authenticate(request, session);
    // console.log('Access Token:', accessToken);

    return Response.json({ accessToken });
};

const ProtectedLayout = () => {
    return (
        <div>
            <h1>Protected Layout</h1>
            <Outlet />
        </div>
    )
}

export default ProtectedLayout