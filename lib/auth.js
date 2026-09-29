import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'dashboard_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 horas

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('Falta la variable de entorno SESSION_SECRET (ver README.md).');
  }
  return secret;
}

export function createSessionToken() {
  const expires = String(Date.now() + SESSION_DURATION_MS);
  const signature = sign(expires, getSecret());
  return `${expires}.${signature}`;
}

export function isValidSessionToken(token) {
  if (!token || typeof token !== 'string') return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature) return false;

  let expected;
  try {
    expected = sign(expires, getSecret());
  } catch {
    return false;
  }

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

  return Number(expires) > Date.now();
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
