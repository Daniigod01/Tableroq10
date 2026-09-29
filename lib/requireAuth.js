import { parse } from 'cookie';
import { isValidSessionToken, SESSION_COOKIE_NAME } from './auth';

// Úsalo al inicio de getServerSideProps en cada página del dashboard:
//   if (!checkAuth(req)) return { redirect: { destination: '/login', permanent: false } };
export function checkAuth(req) {
  const cookies = parse(req.headers.cookie || '');
  return isValidSessionToken(cookies[SESSION_COOKIE_NAME]);
}
