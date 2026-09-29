import { checkAuth } from '../lib/requireAuth';

export async function getServerSideProps({ req }) {
  return {
    redirect: {
      destination: checkAuth(req) ? '/dashboard' : '/login',
      permanent: false,
    },
  };
}

export default function Index() {
  return null;
}
