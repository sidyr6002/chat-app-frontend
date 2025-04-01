import { AvatarFallback } from '@radix-ui/react-avatar';
import { FaCircleUser } from 'react-icons/fa6';
import { ChevronLeft } from 'lucide-react';

import { Avatar, AvatarImage } from '../ui/avatar';

import { useMobileView } from '~/contexts/mobile-view';
import { useActiveConversation } from '~/contexts/active-chat-context';

const ChatSectionHeader = () => {
    const { isMobileView, setIsMobileView } = useMobileView();
    const { selectedConversation } = useActiveConversation();

    if (!selectedConversation) {
      return null
    }

    return (
        <div className='sticky top-0 left-0 w-full px-4 py-6 flex items-center space-x-2 md:space-x-4 bg-gray-50 shadow rounded'>
            {isMobileView && (
                <div className='cursor-pointer' onClick={() => setIsMobileView(false)}>
                    <ChevronLeft className='w-4 h-4 lg:w-5 lg:h-5' />
                </div>
            )}
            <div className='flex flex-row items-center gap-3 md:gap-4'>
                <Avatar className='w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10'>
                    <AvatarImage src={undefined} />
                    <AvatarFallback>
                        <FaCircleUser className="w-full h-full text-gray-400/70" />
                    </AvatarFallback>
                </Avatar>
                <h1 className='text-base font-medium text-stone-800'>{selectedConversation.participant.username}</h1>
            </div>
        </div>
    )
}

export default ChatSectionHeader