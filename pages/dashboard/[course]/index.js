import { useState, useMemo } from 'react';
import Link from 'next/link';
import { checkAuth } from '../../../lib/requireAuth';
import { getCourseSummary, getCourseList } from '../../../lib/dataStore';

const PAGE_SIZE = 50;

function computeStats(students) {
  const total = students.length;
  if (total === 0) {
    return { total: 0, avgProgreso: 0, finalizados: 0, distribucion: [0, 0, 0, 0] };
  }
  const sumProgreso = students.reduce((acc, s) => acc + (s.progreso || 0), 0);
  const finalizados = students.filter((s) => s.progreso === 100).length;

  const distribucion = [0, 0, 0, 0]; // 0-25, 26-50, 51-75, 76-100
  students.forEach((s) => {
    const p = s.progreso || 0;
    if (p <= 25) distribucion[0]++;
    else if (p <= 50) distribucion[1]++;
    else if (p <= 75) distribucion[2]++;
    else distribucion[3]++;
  });

  return {
    total,
    avgProgreso: Math.round(sumProgreso / total),
    finalizados,
    distribucion,
  };
}

export async function getServerSideProps({ req, params }) {
  if (!checkAuth(req)) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const courses = await getCourseList();
  const course = courses.find((c) => c.slug === params.course) || {
    slug: params.course,
    name: params.course,
  };
  const students = await getCourseSummary(params.course);

  students.sort((a, b) =>
    (a.nombreCompleto || a.nombre).localeCompare(b.nombreCompleto || b.nombre)
  );

  const stats = computeStats(students);

  return { props: { course, students, stats } };
}

const DIST_LABELS = ['0 – 25%', '26 – 50%', '51 – 75%', '76 – 100%'];

export default function CoursePage({ course, students, stats }) {
  const [tab, setTab] = useState('tablero');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        (s.nombreCompleto || s.nombre).toLowerCase().includes(q) ||
        s.idDisplay.toLowerCase().includes(q)
    );
  }, [students, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="container">
      <Link href="/dashboard" className="back-link">
        Volver a cursos
      </Link>
      <h1>{course.name}</h1>
      <p className="muted">{stats.total} estudiantes</p>

      <div className="tabs">
        <button
          className={`tab-btn ${tab === 'tablero' ? 'active' : ''}`}
          onClick={() => setTab('tablero')}
        >
          Tablero
        </button>
        <button
          className={`tab-btn ${tab === 'detalle' ? 'active' : ''}`}
          onClick={() => setTab('detalle')}
        >
          Detalle por estudiante
        </button>
      </div>

      {tab === 'tablero' && (
        <div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Estudiantes</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.avgProgreso}%</div>
              <div className="stat-label">Progreso promedio</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.finalizados}</div>
              <div className="stat-label">Con el curso al 100%</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats.total ? Math.round((stats.finalizados / stats.total) * 100) : 0}%
              </div>
              <div className="stat-label">Tasa de finalización</div>
            </div>
          </div>

          <h2>Progreso general del curso</h2>
          <div className="bar-wide-track">
            <div className="bar-wide-fill" style={{ width: `${stats.avgProgreso}%` }} />
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            {stats.avgProgreso}% de avance promedio entre los {stats.total} estudiantes
          </p>

          <h2>Distribución por rango de avance</h2>
          {stats.distribucion.map((count, i) => (
            <div className="dist-row" key={i}>
              <span className="dist-label">{DIST_LABELS[i]}</span>
              <span className="dist-track">
                <span
                  className="dist-fill"
                  style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }}
                />
              </span>
              <span className="dist-count">{count}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'detalle' && (
        <div>
          <div className="toolbar">
            <input
              type="text"
              placeholder="Buscar por nombre o identificación..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Identificación</th>
                  <th>Correo</th>
                  <th>Celular</th>
                  <th>Progreso</th>
                  <th>Promedio final</th>
                  <th>Tiempo total</th>
                  <th>Último acceso</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link href={`/dashboard/${course.slug}/${s.id}`} className="name-link">
                        {s.nombreCompleto || s.nombre}
                      </Link>
                    </td>
                    <td>{s.idDisplay}</td>
                    <td>{s.correo}</td>
                    <td>{s.celular}</td>
                    <td>
                      <span className="progress-inline">
                        <span className="progress-track">
                          <span className="progress-fill" style={{ width: `${s.progreso}%` }} />
                        </span>
                        {s.progreso}%
                      </span>
                    </td>
                    <td>{s.promedioFinal}</td>
                    <td>{s.tiempoTotal}</td>
                    <td>{s.ultimoAcceso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </button>
            <span>
              Página {page + 1} de {totalPages}
            </span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
