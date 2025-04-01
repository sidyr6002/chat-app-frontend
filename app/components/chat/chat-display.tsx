import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';

import ChatPill from './chat-pill';

import Conversation from '~/types/conversation';
import User from '~/types/user';
import DirectMessage from '~/types/direct-message';

const fetchConversationWithId = async (conversationId: string) => {
    const response = await fetch(`/api/conversations/${conversationId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch conversation');
    }
    return response.json();
};

interface ChatDisplayProps {
    conversationId: string;
    participant: User;
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({
    conversationId,
    participant,
}) => {
    const {
        data: conversation,
        isLoading,
        isError,
    } = useQuery<Conversation>({
        queryKey: ['conversation', conversationId],
        queryFn: () => fetchConversationWithId(conversationId),
    });

    const messages: DirectMessage[] = conversation?.messages || [];

    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 120,
    });

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const virtualItems = virtualizer.getVirtualItems();

    //console.log('Conversation:', messages);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !conversation) {
        return <div>Error</div>;
    }

    return (
        <div
            ref={scrollRef}
            className="flex-grow overflow-y-auto contain-strict px-4 py-6"
        >
            <div
                className="relative"
                style={{ height: `${virtualizer.getTotalSize()}px` }}
            >
                <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                        transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                    }}
                >
                    {virtualItems.map(({ index, key }) => {
                        const message = messages[index];
                        return (
                            <div
                                className="my-2"
                                key={key}
                                data-index={index}
                                ref={virtualizer.measureElement}
                            >
                                <ChatPill
                                    message={message}
                                    participant={participant}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatDisplay;
