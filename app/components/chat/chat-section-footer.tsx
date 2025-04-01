import React from 'react';
import { IoSend } from 'react-icons/io5';

import { Input } from '../ui/input';

interface ChatSectionFooterProps {
    message: string;
    setMessage: (message: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ChatSectionFooter: React.FC<ChatSectionFooterProps> = ({
    message,
    setMessage,
    onSubmit,
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="sticky bottom-0 left-0 w-full px-4 py-6 bg-gray-50 shadow-top rounded"
        >
            <div className="flex flex-row items-center gap-6">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="py-5 bg-gray-300/85 focus-visible:ring-0"
                />
                <button type="submit" className="p-2.5 rounded-md bg-blue-600 hover:bg-blue-700">
                    <IoSend className=" text-white w-5 h-5" />
                </button>
            </div>
        </form>
    );
};

export default ChatSectionFooter;
