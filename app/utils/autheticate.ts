import axios from "axios";
import { redirect, Session } from "react-router";

import AuthorizationError from "~/errors/authorization-error";
import { commitSession, destroySession } from "~/session.server";

function isTokenExpired(token: string): boolean {
    try {
      // Decode the JWT payload (this assumes a standard JWT structure)
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true;
    }
}

async function authenticate(
    request: Request,
    session: Session,
) {
    try {
        const accessToken = session.get('accessToken');
        //console.log('Old Access Token:', accessToken);
    
        if (!accessToken) {
            throw redirect('/sign-in', {
                headers: {
                    'Set-Cookie': await destroySession(session),
                },
            });
        }

        if (isTokenExpired(accessToken)) {
            //console.log('Token is expired');
            throw new AuthorizationError('Access token is expired');
        }

        return accessToken;
    } catch (error) {
        if (error instanceof AuthorizationError) {
            //console.log('Refreshing token...');

            const backendUrl = process.env.BACKEND_URL || '';
            const refreshToken = session.get('refreshToken');

            if (!refreshToken || isTokenExpired(refreshToken)) {
                throw redirect('/sign-in', {
                    headers: {
                        'Set-Cookie': await destroySession(session),
                    },
                });
            }
        
            // Call your refresh endpoint
            const response = await axios.post(
                `${backendUrl}/auth/refresh`,
                { refreshToken },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

            // console.log('New Access Token:', newAccessToken);
            // console.log('New Refresh Token:', newRefreshToken);
        
            session.set('accessToken', newAccessToken);
            session.set('refreshToken', newRefreshToken);
        
            if (request.method === 'GET') {
                throw redirect(request.url, {
                    headers: {
                        'Set-Cookie': await commitSession(session),
                    },
                });
            }

            return newAccessToken;
        }

        throw error;
    }
}

export default authenticate;