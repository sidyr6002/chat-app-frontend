import { LoaderFunction, Outlet, useLoaderData } from "react-router"

import { getSession } from "~/session.server";
import User from "~/types/user";
import authenticate from "~/utils/autheticate.server";
import getUser from "~/utils/getUser";


// TODO: Move getUser to api.server.ts

// export const loader: LoaderFunction = async ({ request }) => {
//     const session = await getSession(request);
    
//     const accessToken = await authenticate(request, session);
//     // console.log('Access Token:', accessToken);
//     const user = await getUser(accessToken);

//     return Response.json({ user });
// };

const ProtectedLayout = () => {
    //const { user } = useLoaderData<{ user: User }>();

    return (
        <div className="h-svh w-svm flex">
            <Outlet />
        </div>
    )
}

export default ProtectedLayout