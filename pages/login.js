import { useState } from 'react';
import { useRouter } from 'next/router';
import { checkAuth } from '../lib/requireAuth';

export async function getServerSideProps({ req }) {
  if (checkAuth(req)) {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }
  return { props: {} };
}

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || 'No se pudo iniciar sesión');
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h1>Seguimiento de formación</h1>
        <p className="muted">Ingresa la clave de acceso que te compartieron.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Clave de acceso"
          autoFocus
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
