import { createCookie } from "react-router";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const authCookie = createCookie('auth', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 604800, // 1 week
  path: '/',
  secrets: [sessionSecret],
});