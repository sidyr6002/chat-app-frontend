import { useQuery } from '@tanstack/react-query';
import { memo, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual'

import RecentChatPill from './recent-chat-pill';


// import { getUserChats } from '~/utils/api.server';
import Chat from '~/types/conversation';
import { useMobileView } from '~/contexts/mobile-view';
import { useActiveConversation } from '~/contexts/active-chat-context';

const fetchConversations = async () => {
    const response = await fetch('/api/conversations');

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
};

const RecentChats = () => {
    const { data: conversations = [], isLoading, isError} = useQuery<Chat[]>({
        queryKey: ['conversations'],
        queryFn: fetchConversations,
    })
    
    const {setSelectedConversation} = useActiveConversation();
    const { setIsMobileView } = useMobileView();
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current && conversations.length > 0) {
            setSelectedConversation(conversations[0]);
            isInitialized.current = true;
        }
    }, [conversations, setSelectedConversation]);

    //console.log('Chats:', chats);
    const parentRef = useRef<HTMLDivElement | null>(null);

    const virtualizer = useVirtualizer ({
        count: conversations.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80, 
    });

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (isError) {
        return (
            <div>Error in loading chats</div>
        )
    }

    const handleSelectChat = (chat: Chat) => {
        setSelectedConversation(chat);

        if (window.innerWidth < 1024) {
            setIsMobileView(true);
        }
    }

    return (
        <div className="flex-grow flex flex-col">
            <h3 className="text-blue-700 text-xs after:block after:w-full after:h-px after:bg-gray-400/30">
                Recent Chats
            </h3>

            {/* Chat List */}
            <div ref={parentRef} className='mt-2 flex-grow contain-strict overflow-y-auto custom-scrollbar'>
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const conversation = conversations[virtualItem.index];
                        return (<div
                            key={virtualItem.key}
                            data-index={virtualItem.index}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualItem.size}px`,
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                            className='flex items-center py-1'
                            onClick={() => handleSelectChat(conversation)}
                        >
                            <RecentChatPill conversation={conversation} />
                        </div>
                        )
                    })}

                </div>
            </div>
        </div>
    );
};

export default memo(RecentChats);
