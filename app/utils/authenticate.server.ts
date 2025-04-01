import axios from 'axios';
import { redirect, Session } from 'react-router';

import { withRefreshLock } from './refresh-lock';

import AuthorizationError from '~/errors/authorization-error';
import { commitSession, destroySession } from '~/session.server';


function isTokenExpired(token: string): boolean {
    try {
        // Decode the JWT payload (this assumes a standard JWT structure)
        const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );
        console.log('Time Now:', new Date(Date.now()));
        console.log('Time Expired:', new Date(payload.exp * 1000));
        return Date.now() >= payload.exp * 1000;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
}

/**
 * Authenticates the user using the provided session.
 * If the access token is missing or expired, it will attempt to refresh the token.
 * If the refresh token is missing or expired, it will redirect to the sign-in page.
 * If the refresh token is invalid, it will redirect to the sign-in page.
 *
 */
async function authenticate(request: Request, session: Session, isApiRequest: boolean = false) {
    try {
        const accessToken = session.get('accessToken');
        console.log('Old Access Token:', accessToken);

        if (!accessToken) {
            throw redirect('/sign-in', {
                headers: {
                    'Set-Cookie': await destroySession(session),
                },
            });
        }

        if (isTokenExpired(accessToken)) {
            console.log('Token is expired');
            throw new AuthorizationError('Access token is expired');
        }

        return accessToken;
    } catch (error) {
        if (error instanceof AuthorizationError) {
            return withRefreshLock(async () => {                
                console.log('Refreshing token...');
    
                const backendUrl = process.env.BACKEND_URL || '';
                const refreshToken = session.get('refreshToken');
    
                if (!refreshToken || isTokenExpired(refreshToken)) {
                    throw redirect('/sign-in', {
                        headers: {
                            'Set-Cookie': await destroySession(session),
                        },
                    });
                }
    
                try {
                    const response = await axios.post(
                        `${backendUrl}/auth/refresh`,
                        { refreshToken },
                        {
                            headers: { 'Content-Type': 'application/json' },
                        }
                    );
    
                    const {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    } = response.data;
    
                    console.log('Refreshing token...');
                    console.log('New Access Token:', newAccessToken);
                    console.log('New Refresh Token:', newRefreshToken);
    
                    session.set('accessToken', newAccessToken);
                    session.set('refreshToken', newRefreshToken);

                    if (isApiRequest) {
                        return newAccessToken;
                    }
    
                    if (request.method === 'GET') {
                        throw redirect(request.url, {
                            headers: {
                                'Set-Cookie': await commitSession(session),
                            },
                        });
                    }
    
                    return newAccessToken;
                } catch (error) {
                    console.error('Error refreshing token:', error);
    
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 401) {
                            console.log(
                                'Refresh token is invalid or expired. Redirecting to sign-in.'
                            );
                            throw redirect('/sign-in', {
                                headers: {
                                    'Set-Cookie': await destroySession(session),
                                },
                            });
                        } else if (error.request) {
                            console.log(
                                'No Response Received. Request Details:',
                                error.request
                            );
                        } else {
                            console.log('Unknown Axios Error:', error.message);
                        }
                    }
    
                    throw error;
                }
            })
        }

        throw error;
    }
}

export default authenticate;
