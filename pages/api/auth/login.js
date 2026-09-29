import { serialize } from 'cookie';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Método no permitido' });
    return;
  }

  const { password } = req.body || {};
  const expected = process.env.DASHBOARD_PASSWORD;

  if (!expected) {
    res.status(500).json({ ok: false, message: 'El servidor no tiene configurada DASHBOARD_PASSWORD' });
    return;
  }

  if (password && password === expected) {
    const token = createSessionToken();
    res.setHeader(
      'Set-Cookie',
      serialize(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
      })
    );
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false, message: 'Clave incorrecta' });
  }
}
