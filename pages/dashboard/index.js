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

      <div className="stats-bar">
        <img src="/logo-pago-resultados.png" alt="Pago por Resultados" className="stats-bar-logo" />
        <div className="stats-bar-right">
          <div className="stats-bar-numbers">
            <div className="stat-pill">
              <div className="stat-pill-value">{courses.length}</div>
              <div className="stat-pill-label">cursos</div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-value">{totalInscripciones.toLocaleString('es-CO')}</div>
              <div className="stat-pill-label">inscripciones</div>
            </div>
          </div>
          <div className="stats-bar-meta">
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
            <br />
            <button
              type="button"
              className="sync-now-btn"
              onClick={handleSyncNow}
              disabled={syncing}
            >
              {syncing ? 'Actualizando… puede tardar un momento' : 'Actualizar ahora'}
            </button>
            {syncMessage && (
              <div className={`sync-message sync-message-${syncMessage.type}`}>
                {syncMessage.text}
              </div>
            )}
          </div>
        </div>
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
