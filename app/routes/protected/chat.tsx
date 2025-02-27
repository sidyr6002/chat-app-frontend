import { dehydrate, DehydratedState, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { LoaderFunction, useLoaderData } from "react-router"

import ChatSection from "~/components/chat/chat-section"
import SideBar from "~/components/tabs/side-bar"
import TabSection from "~/components/tabs/tab-section"
import { ChatProvider } from "~/contexts/chat-context"
import { TabsProvider } from "~/contexts/tab-context"
import { getUserChats } from "~/utils/api"

export const loader: LoaderFunction = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['chats'],
        queryFn: getUserChats,
    })

    return Response.json({ dehydratedState: dehydrate(queryClient) });
    
}

const Chat = () => {
    const { dehydratedState } = useLoaderData<{ dehydratedState: DehydratedState }>();

    return (
        <HydrationBoundary state={dehydratedState}>
            <TabsProvider>
                <ChatProvider>
                    <SideBar />
                    <div className="w-full h-full flex relative overflow-hidden">
                        <TabSection />
                        <ChatSection />
                    </div>
                </ChatProvider>
            </TabsProvider>
        </HydrationBoundary>
    )
}

export default Chat