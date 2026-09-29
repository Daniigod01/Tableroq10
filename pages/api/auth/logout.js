import { serialize } from 'cookie';
import { SESSION_COOKIE_NAME } from '../../../lib/auth';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    serialize(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  );
  res.status(200).json({ ok: true });
}
