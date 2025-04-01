import React, { useCallback, useEffect, useState } from 'react';

import ChatSectionHeader from './chat-section-header';
import ChatDisplay from './chat-display';
import ChatSectionFooter from './chat-section-footer';

import { useMobileView } from '~/contexts/mobile-view';
import { cn } from '~/lib/utils';
import { useActiveConversation } from '~/contexts/active-chat-context';
import { useSocketContext } from '~/contexts/socket-context';

const ChatSection = () => {
    const {socket, isConnected: socketConnected } = useSocketContext();
    const { isMobileView } = useMobileView();
    const { selectedConversation } = useActiveConversation();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!socket) return;

        const handleConnect = () => {
            console.log('Socket connected', socket.id);
        };

        const handleMessage = (data: string) => {
            console.log('Received message:', data);
        };

        socket.on('connect', handleConnect);
        socket.on('message', handleMessage);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('message', handleMessage);
        };
    }, [socket]);

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
