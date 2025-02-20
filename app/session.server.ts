// app/session.server.ts
import { createCookieSessionStorage } from 'react-router';

import { authCookie } from './auth.server';

export const sessionStorage = createCookieSessionStorage({
  cookie: authCookie,
});

export const { getSession, commitSession, destroySession } = sessionStorage;