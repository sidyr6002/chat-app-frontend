import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useNavigate } from 'react-router';
import { Socket } from 'socket.io-client';

import { useSocket } from '~/hooks/use-socket';

interface SocketContextProps {
    socket: Socket | null;
    isConnected: boolean;
    error: Error | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider = ({
    accessToken,
    children,
}: {
    accessToken: string;
    children: React.ReactNode;
}) => {
    const socket = useSocket(accessToken);
    const [isConnected, setIsConnected] = useState(socket?.connected || false);
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();

    // Connection status handling
    useEffect(() => {
        const handleConnect = () => {
            console.log('Socket connected(client)', socket?.id);
            setIsConnected(true);
            setError(null);
        };
        const handleDisconnect = () => setIsConnected(false);
    
        if (socket) {
            socket.on('connect', handleConnect);
            socket.on('disconnect', handleDisconnect);
        }
    
        return () => {
            if (socket) {
                socket.off('connect', handleConnect);
                socket.off('disconnect', handleDisconnect);
            }
        };
    }, [socket]);

    // Error handling
    useEffect(() => {
        if (!socket) return;

        const handleError = (err: Error) => {
            setError(err);
            if (err.message === 'Unauthorized') {
                navigate('/sign-in');
            }
        };

        socket.on('connect_error', handleError);
        socket.on('error', handleError);

        return () => {
            socket.off('connect_error', handleError);
            socket.off('error', handleError);
        };
    }, [socket, navigate]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            socket?.disconnect();
        };
    }, [socket]);

    const value = useMemo(
        () => ({
            socket,
            isConnected,
            error,
        }),
        [socket, isConnected, error]
    );

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = (): SocketContextProps => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error(
            'useSocketContext must be used within a SocketProvider'
        );
    }
    return context;
};
