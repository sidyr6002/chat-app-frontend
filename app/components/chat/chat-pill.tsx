import { cn } from '~/lib/utils';
import DirectMessage from '~/types/direct-message';
import User from '~/types/user';

interface ChatPillProps {
    message: DirectMessage;
    participant: User;
}

const ChatPill: React.FC<ChatPillProps> = ({ message, participant }) => {
    return (
        <div
            key={message.id}
            className={cn(
                'flex transition-all rounded-xl px-3 py-2',
                message.receiverId === participant.id
                    ? 'justify-end'
                    : 'justify-start'
            )}
        >
            {/* Left side (other users) */}
            <div
                className={cn(
                    'flex flex-col space-y-1 max-w-md',
                    message.receiverId === participant.id
                        ? 'items-end'
                        : 'items-start'
                )}
            >
                {/* User info (only for others) */}
                {message.receiverId !== participant.id && (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-[10px] md:text-xs">
                                {participant.username[0].toUpperCase()}
                            </span>
                        </div>
                        <p className="font-medium text-[10px] md:text-xs text-gray-500">
                            {participant.username.toUpperCase()}
                        </p>
                    </div>
                )}

                {/* Message bubble */}
                <div
                    className={cn(
                        'px-4 py-2 rounded-lg text-xs md:text-sm cursor-pointer',
                        message.receiverId === participant.id
                            ? 'bg-blue-700 text-white rounded-br-none'
                            : 'bg-white rounded-bl-none shadow'
                    )}
                >
                    <p>{message.content}</p>
                    <span
                        className={cn(
                            'block text-[10px] md:text-xs mt-2',
                            message.receiverId === participant.id
                                ? 'text-gray-300'
                                : 'text-gray-500'
                        )}
                    >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatPill;
