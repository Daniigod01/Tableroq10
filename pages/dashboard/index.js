import { useState } from 'react';
import Link from 'next/link';
import { checkAuth } from '../../lib/requireAuth';
import { getCourseList, getLastSync } from '../../lib/dataStore';

export async function getServerSideProps({ req }) {
  if (!checkAuth(req)) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const courses = await getCourseList();
  const lastSync = await getLastSync();

  return { props: { courses, lastSync } };
}

function courseTag(name) {
  const n = name.toLowerCase();
  if (n.includes('inserción laboral') || n.includes('insercion laboral')) return 'Inserción laboral';
  if (n.includes('mayor 50') || n.includes('mayor de 50')) return 'Mayor de 50 años';
  if (n.includes('habilidades')) return 'Habilidades para la vida';
  return 'Formación';
}

export default function DashboardHome({ courses, lastSync }) {
  const totalInscripciones = courses.reduce((acc, c) => acc + (c.totalEstudiantes || 0), 0);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null); // { type: 'ok' | 'error', text }

  async function handleSyncNow() {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/sync-now', { method: 'POST' });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          res.status === 504
            ? 'La sincronización tardó demasiado. Intenta de nuevo en un momento.'
            : 'El servidor devolvió una respuesta inesperada.'
        );
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.error || data.message || 'No se pudo actualizar');
      }
      setSyncMessage({ type: 'ok', text: 'Datos actualizados.' });
      // Recarga la página para traer los datos ya sincronizados
      // (getServerSideProps se vuelve a ejecutar).
      window.location.reload();
    } catch (err) {
      setSyncing(false);
      setSyncMessage({ type: 'error', text: err.message || 'No se pudo actualizar. Intenta de nuevo.' });
    }
  }

  return (
    <div className="container">
      <p className="eyebrow">Formación y oportunidades</p>
      <h1>Seguimiento de cursos</h1>
      <p className="hero-subtitle">Una mirada al avance de cada proceso de formación.</p>

      <div className="hero-banner">
        <svg className="hero-banner-bg" viewBox="0 0 1100 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M0 90 C 120 110 250 170 430 240 L0 240 Z" fill="#eaf3fd" />
          <path d="M0 175 C 90 160 200 175 330 240 L0 240 Z" fill="#d6e8fb" />
          <path d="M0 236 C 120 188 285 188 400 240" fill="none" stroke="#1565c0" strokeWidth="2.5" />
          <path d="M1100 80 C 980 100 850 170 700 240 L1100 240 Z" fill="#eaf3fd" />
          <path d="M1100 165 C 1010 150 920 170 810 240 L1100 240 Z" fill="#d6e8fb" />
          <path d="M700 240 C 800 196 950 192 1100 236" fill="none" stroke="#19a7f0" strokeWidth="2.5" />
        </svg>

        <img
          src="/logo-pago-resultados-transparente.png"
          alt="Pago por Resultados"
          className="hero-logo hero-logo-left"
        />

        <div className="hero-center">
          <div className="hero-pills">
            <div className="stat-pill">
              <div className="stat-pill-value">{courses.length}</div>
              <div className="stat-pill-label">cursos</div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-value">{totalInscripciones.toLocaleString('es-CO')}</div>
              <div className="stat-pill-label">inscripciones</div>
            </div>
          </div>

          <div className="hero-meta">
            {lastSync ? (
              <>
                Última actualización
                <br />
                {new Date(lastSync).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                {' '}
                {new Date(lastSync).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </>
            ) : (
              'Sin sincronizar todavía'
            )}
          </div>

          <button type="button" className="sync-now-btn hero-sync" onClick={handleSyncNow} disabled={syncing}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 4v5h-5" />
            </svg>
            {syncing ? 'Actualizando… puede tardar un momento' : 'Actualizar ahora'}
          </button>
          {syncMessage && (
            <div className={`sync-message sync-message-${syncMessage.type}`}>{syncMessage.text}</div>
          )}
        </div>

        <img
          src="/logo-gente-estrategica-cft.png"
          alt="Gente Estratégica – Centro de Formación para el Trabajo"
          className="hero-logo hero-logo-right"
        />
      </div>

      <div className="course-grid">
        {courses.map((c, i) => (
          <div className="course-card" key={c.slug}>
            <div className="course-card-top">
              <span className="course-card-tag">{courseTag(c.name)}</span>
              <span className="course-card-num">Curso {String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="course-card-title">{c.name}</h3>
            <p className="course-card-count">{c.totalEstudiantes} estudiantes inscritos</p>

            <div className="avance-row">
              <span className="avance-label">Avance promedio</span>
              <span className="avance-value">{c.avgProgreso ?? 0}%</span>
            </div>
            <div className="avance-track">
              <div className="avance-fill" style={{ width: `${c.avgProgreso ?? 0}%` }} />
            </div>

            <div className="course-card-bottom">
              <span className="course-card-finished">{c.finalizados ?? 0} finalizaron</span>
              <Link href={`/dashboard/${c.slug}`} className="ver-link">
                Ver estudiantes →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <p className="muted" style={{ marginTop: 24 }}>
          No hay datos todavía. Verifica que la carpeta de Google Drive tenga
          las subcarpetas de cada curso con sus dos archivos exportados, y
          espera a la próxima sincronización automática.
        </p>
      )}
    </div>
  );
}
