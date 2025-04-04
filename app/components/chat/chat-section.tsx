import React, { useCallback, useEffect, useState } from 'react';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import ChatSectionHeader from './chat-section-header';
import ChatDisplay from './chat-display';
import ChatSectionFooter from './chat-section-footer';

import { useMobileView } from '~/contexts/mobile-view';
import { cn } from '~/lib/utils';
import { useActiveConversation } from '~/contexts/active-chat-context';
import { useSocketContext } from '~/contexts/socket-context';
import DirectMessage, { DirectMessageResponse } from '~/types/direct-message';
import { useConversationManager } from '~/stores/managers/conversation-store-manager';


const ChatSection = () => {
    const queryClient = useQueryClient();
    const {socket, isConnected: socketConnected } = useSocketContext();
    const { isMobileView } = useMobileView();
    const { selectedConversation } = useActiveConversation();

    const { getStore, removeStore } = useConversationManager();

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!socket || !selectedConversation) return;

        const handleConnect = () => {
            console.log('Socket connected', socket.id);
        };

        const handleMessage = (newMessage: DirectMessage) => {
            console.log('Received message:', newMessage);

            if (newMessage.conversationId !== selectedConversation.id) return;

            queryClient.setQueryData<InfiniteData<DirectMessageResponse>>(
                ['direct-messages', selectedConversation.id],
                (oldData) => {
                    if (!oldData) {
                        return {
                            pages: [{ messages: [newMessage], nextCursor: null }],
                            pageParams: [undefined],
                        };
                    }

                    // Clone existing pages to avoid mutation
                    const newPages = [...oldData.pages];
                    
                    // Add message to the first page (most recent messages)
                    if (newPages[0].messages.length < 10) {
                        newPages[0] = {
                            ...newPages[0],
                            messages: [newMessage, ...newPages[0].messages],
                        };
                    } else {
                        // Create new page if first page is full
                        newPages.unshift({
                            messages: [newMessage],
                            nextCursor: newPages[0].nextCursor,
                        });
                    }

                    return { ...oldData, pages: newPages };
                }
            )

            const conversationStore = getStore(selectedConversation.id);
            const currentState = conversationStore.getState();

            if (!currentState.isAutoScroll) {
                currentState.actions.incrementNewMessageCount();
            } 
        };

        socket.on('connect', handleConnect);
        socket.on('message', handleMessage);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('message', handleMessage);
            removeStore(selectedConversation.id);
        };
    }, [socket, selectedConversation, queryClient, getStore, removeStore]);

    useEffect(() => {
        if (!socket || !selectedConversation) return;
        socket.emit('joinConversation', selectedConversation.id);
    }, [socket, selectedConversation]);

    const handleSendMessage = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!socket || !selectedConversation || !message.trim()) return;

        socket.emit('sendDirectMessage', {
            conversationId: selectedConversation.id,
            message,
        });

        setMessage('');
    }, [socket, selectedConversation, message]);

    if (!socketConnected || !selectedConversation) {
        return null;
    }

    return (
        <div
            className={cn(
                'w-full h-full bg-gray-100 absolute inset-0 lg:relative flex flex-col',
                isMobileView ? 'z-10 transition' : 'hidden lg:flex'
            )}
        >
            <ChatSectionHeader />
            <ChatDisplay conversationId={selectedConversation.id} participant={selectedConversation.participant}/>
            <ChatSectionFooter
                message={message}
                setMessage={setMessage}
                onSubmit={handleSendMessage}
            />
        </div>
    );
};

export default ChatSection;
