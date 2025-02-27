import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual'

import RecentChatPill from './recent-chat-pill';

import { useChat } from '~/contexts/chat-context';
// import { getUserChats } from '~/utils/api.server';
import Chat from '~/types/chat';
import { getUserChats } from '~/utils/api';

const RecentChats = () => {
    const { data: chats = []} = useQuery<Chat[]>({
        queryKey: ['chats'],
        queryFn: getUserChats,
    })
    
    const {setSelectedChat} = useChat();
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current && chats.length > 0) {
            setSelectedChat(chats[0]);
            isInitialized.current = true;
        }
    }, [chats, setSelectedChat]);


    console.log('Chats:', chats);

    const parentRef = useRef<HTMLDivElement | null>(null);

    const virtualizer = useVirtualizer ({
        count: chats.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80, 
    });

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
                        const chat = chats[virtualItem.index];
                        return (<div
                            key={virtualItem.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualItem.size}px`,
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                            className='flex items-center'
                        >
                            <RecentChatPill chat={chat} />
                        </div>
                        )
                    })}

                </div>
            </div>
        </div>
    );
};

export default RecentChats;
