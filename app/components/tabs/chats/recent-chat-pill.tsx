import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { FaCircleUser } from 'react-icons/fa6';

import Chat from '~/types/chat';

interface RecentChatPillProps {
    chat: Chat;
}

const RecentChatPill: React.FC<RecentChatPillProps> = ({ chat }) => {
    return (
        <div
            key={chat.id}
            className="w-full h-full p-2 rounded-lg flex flex-row gap-2.5 items-center hover:bg-gray-300 transition"
        >
            {/* User Image */}
            <Avatar className='w-10 h-10 flex-shrink-0'>
                <AvatarImage src={chat.userImage} className='w-full h-full rounded-full' />
                <AvatarFallback>
                    <FaCircleUser className="w-full h-full text-gray-400/70" />
                </AvatarFallback>
            </Avatar>

            {/* Chat Details */}
            <div className="flex flex-col gap-1.5">
                <p className="font-medium text-sm">{chat.name}</p>
                <p className="text-xs text-gray-500 line-clamp-1 text-ellipsis">{chat.message}</p>
            </div>
        </div>
    );
};

export default RecentChatPill;
