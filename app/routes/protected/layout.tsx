import { LoaderFunction, Outlet, useLoaderData } from 'react-router';
import { dehydrate, DehydratedState, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import ChatProviderMiddleware from '~/providers/chat-provider-middleware';
import { getSession } from '~/session.server';
import authenticate from '~/utils/authenticate.server';
import { getUser, getUserConversations } from '~/utils/api.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);
    const accessToken = await authenticate(request, session);

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ['user'],
            queryFn: () => getUser(accessToken),
        }),
        queryClient.prefetchQuery({
            queryKey: ['conversations'],
            queryFn: () => getUserConversations(accessToken),
        })
    ]);

    return Response.json({ dehydratedState: dehydrate(queryClient), accessToken });
};

const ProtectedLayout = () => {
    const { dehydratedState, accessToken } = useLoaderData<{
        dehydratedState: DehydratedState;
        accessToken: string;
    }>();

    return (
        <HydrationBoundary state={dehydratedState}>
            <ChatProviderMiddleware accessToken={accessToken}>
                <div className="h-svh w-svm flex">
                    <Outlet />
                </div>
            </ChatProviderMiddleware>
        </HydrationBoundary>
    );
};

export default ProtectedLayout;
