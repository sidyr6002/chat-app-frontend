import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader } from 'lucide-react';

import ChatPill from './chat-pill';

import User from '~/types/user';
import DirectMessage from '~/types/direct-message';


interface MessageResponse {
    messages: DirectMessage[];
    nextCursor: string | null;
}

const fetchMessagesForConversation = async ({
    conversationId,
    pageParam = undefined,
}: {
    conversationId: string;
    pageParam?: string;
}): Promise<MessageResponse> => {
    const params = new URLSearchParams();
    if (pageParam) params.append('cursor', pageParam);
    params.append('take', '10');

    const response = await fetch(
        `/api/conversations/${conversationId}/messages?${params.toString()}`
    );
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
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const {
        status,
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<MessageResponse>({
        queryKey: ['conversation', conversationId],
        queryFn: ({ pageParam }) =>
            fetchMessagesForConversation({
                conversationId,
                pageParam: pageParam as string | undefined,
            }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const messages: DirectMessage[] = data
        ? data.pages.flatMap((page) => page.messages)
        : [];

    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 500,
        overscan: 5,
    });

    const virtualItems = virtualizer.getVirtualItems();

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = scrollElement;
            const threshold = 100; // pixels from the bottom to trigger the next fetch
            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }
        };

        scrollElement.addEventListener('scroll', handleScroll);
        return () => {
            scrollElement.removeEventListener('scroll', handleScroll);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;
      
        const handleWheel = (e: WheelEvent) => {
          e.preventDefault();
          scrollElement.scrollBy(0, -e.deltaY);
        };
      
        scrollElement.addEventListener('wheel', handleWheel, { passive: false });
      
        return () => {
            scrollElement.removeEventListener('wheel', handleWheel);
        };
      }, [status]);

    if (isLoading) {
        return <div className="flex-grow">Loading...</div>;
    }

    if (isError || !messages) {
        return <div className="flex-grow">Error</div>;
    }

    return (
        <div
            ref={scrollRef}
            className="flex-grow overflow-y-auto contain-strict px-4 py-4"
            style={{ transform: 'scaleY(-1)' }}
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
                                style={{
                                    transform: `scaleY(-1)`,
                                }}
                            >
                                <ChatPill
                                    message={message}
                                    participant={participant}
                                />
                            </div>
                        );
                    })}
                {isFetchingNextPage && (<div className="absolute bottom-0 left-0 w-full flex items-center justify-center m-2 text-neutral-400">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span className="sr-only">Loading more messages...</span>
                </div>)}
                </div>
            </div>
            
        </div>
    );
};

export default ChatDisplay;
