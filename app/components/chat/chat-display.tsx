import React, { useCallback, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader } from 'lucide-react';

import ChatPill from './chat-pill';

import User from '~/types/user';
import DirectMessage, { DirectMessageResponse } from '~/types/direct-message';
import { useConversationManager } from '~/stores/managers/conversation-store-manager';

const fetchMessagesForConversation = async ({
    conversationId,
    pageParam = undefined,
}: {
    conversationId: string;
    pageParam?: string;
}): Promise<DirectMessageResponse> => {
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
    } = useInfiniteQuery<DirectMessageResponse>({
        queryKey: ['direct-messages', conversationId],
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

    const { getHook, removeStore } = useConversationManager();

    const { useNewMessageCount, useIsAutoScroll, useActions } =
        getHook(conversationId);

    const isAutoScroll = useIsAutoScroll();
    const newMessageCount = useNewMessageCount();
    const { resetNewMessageCount, setIsAutoScroll } = useActions();

    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 500,
        overscan: 5,
    });

    const virtualItems = virtualizer.getVirtualItems();

    // Track scroll position with debounce
    const checkScrollPosition = useCallback(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        // Since the container is inverted with scaleY(-1),
        // "top" of content is actually at scrollHeight
        // and "bottom" is at 0
        const { scrollTop } = scrollElement;
        const threshold = 100;

        // Near "top" (original bottom) means scrollTop is small
        const isNearTop = scrollTop <= threshold;
        setIsAutoScroll(isNearTop);

        // Reset new messages count if user scrolls to top manually
        if (isNearTop && newMessageCount > 0) {
            resetNewMessageCount();
        }
    }, [setIsAutoScroll, newMessageCount, resetNewMessageCount]);

    // const debouncedCheckScroll = useDebounce(checkScrollPosition, 100);

    // Fetch more messages when user scrolls to the bottom
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

    // Handle new messages and scroll behavior
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        if (isAutoScroll) {
            // Auto-scroll to "top" (which is bottom in inverted view)
            scrollElement.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [isAutoScroll]);

    // Reverse the mouse wheel scrolling so that it scrolls up instead of down
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            scrollElement.scrollBy(0, -e.deltaY);
        };

        scrollElement.addEventListener('wheel', handleWheel, {
            passive: false,
        });

        return () => {
            scrollElement.removeEventListener('wheel', handleWheel);
        };
    }, [status]);

    //Clean up the store after unmount
    useEffect(() => {
        return () => {
            removeStore(conversationId);
        };
    }, [removeStore, conversationId]);

    if (isLoading) {
        return <div className="flex-grow">Loading...</div>;
    }

    if (isError || !messages) {
        return <div className="flex-grow">Error</div>;
    }

    return (
        <div className="relative flex-grow py-2">
            <div
                ref={scrollRef}
                className="h-full overflow-y-auto contain-strict px-4"
                onScroll={checkScrollPosition}
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
                        {isFetchingNextPage && (
                            <div className="absolute bottom-0 left-0 w-full flex items-center justify-center m-2 text-neutral-400">
                                <Loader className="h-5 w-5 animate-spin" />
                                <span className="sr-only">
                                    Loading more messages...
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {newMessageCount > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105">
                        {newMessageCount} new message
                        {newMessageCount > 1 ? 's' : ''}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatDisplay;
