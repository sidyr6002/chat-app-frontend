import React from 'react';
import { FaCircleUser } from 'react-icons/fa6';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useActiveConversation } from '~/contexts/active-chat-context';
import { cn } from '~/lib/utils';
import Conversation from '~/types/conversation';

interface RecentChatPillProps {
    conversation: Conversation;
}

const RecentChatPill: React.FC<RecentChatPillProps> = ({ conversation }) => {
    const { selectedConversation } = useActiveConversation();

    return (
        <div
            key={conversation.id}
            className={cn("w-full h-full p-2 rounded-lg flex flex-row gap-2.5 items-center hover:bg-gray-300 transition", selectedConversation?.id === conversation.id && "lg:bg-gray-300")}
        >
            {/* User Image */}
            <Avatar className='w-10 h-10 flex-shrink-0'>
                <AvatarImage src={undefined} className='w-full h-full rounded-full' />
                <AvatarFallback>
                    <FaCircleUser className="w-full h-full text-gray-400/70" />
                </AvatarFallback>
            </Avatar>

            {/* Chat Details */}
            <div className="flex flex-col gap-1.5">
                <p className="font-medium text-sm">{conversation.participant.username}</p>
                <p className="text-xs text-gray-500 line-clamp-1 text-ellipsis">{conversation.lastMessage?.content || "\u200B"}</p>
            </div>
        </div>
    );
};

export default RecentChatPill;
