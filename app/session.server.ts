// // app/session.server.ts
import { createCookieSessionStorage, Session } from 'react-router';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // The name of the session cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
    secrets: [sessionSecret],
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function isAuthenticated(request: Request) {
  const session = await getSession(request);
  const accessToken = session.get('accessToken');
  return !!accessToken; // Return true if the access token exists
}

export async function destroySession(session: Session) {
  return sessionStorage.destroySession(session);
}

export async function commitSession(session: Session) {
  return sessionStorage.commitSession(session);
}