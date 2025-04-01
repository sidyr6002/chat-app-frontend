import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { io, Socket } from 'socket.io-client';

import { withRefreshLock } from '~/utils/refresh-lock';

const BACKEND_URL = 'http://localhost:3000';

export const useSocket = (initialAccessToken: string): Socket | null => {
    const [accessToken, setAccessToken] = useState(initialAccessToken);
    const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null); // For re-renders
    const isMounted = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        isMounted.current = true;

        const initializeSocket = async () => {
            console.log('Initializing socket...');
            
            // Clean up existing socket
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            // Create new socket
            const newSocket = io(BACKEND_URL, {
                auth: { token: accessToken },
                autoConnect: false
            });

            socketRef.current = newSocket;
            setSocket(newSocket); // Update state to trigger re-renders

            // Handle token refresh on unauthorized error
            newSocket.on('connect_error', async (error) => {
                if (error.message === 'Unauthorized' && isMounted.current) {
                    try {
                        await withRefreshLock(async () => {
                            const response = await fetch('/api/refresh-token');
                            if (!response.ok) throw new Error('Refresh failed');
                            const { accessToken: newToken } = await response.json();
                            if (isMounted.current) {
                                setAccessToken(newToken);
                                newSocket.auth = { token: newToken };
                                newSocket.connect();
                            }
                        });
                    } catch (err) {
                        console.error('Error refreshing token:', err);
                        if (isMounted.current) navigate('/sign-in');
                    }
                }
            });

            newSocket.connect();
        };

        initializeSocket();

        return () => {
            isMounted.current = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        };
    }, [accessToken, navigate]); // Only re-run when accessToken or navigate changes

    return socket;
};