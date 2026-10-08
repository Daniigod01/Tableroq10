import Link from 'next/link';
import { checkAuth } from '../../../lib/requireAuth';
import { getCourseDetail, getCourseSummary, getCourseList } from '../../../lib/dataStore';
import { groupByModules } from '../../../lib/modulos';

export async function getServerSideProps({ req, params }) {
  if (!checkAuth(req)) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const courses = await getCourseList();
  const course = courses.find((c) => c.slug === params.course) || {
    slug: params.course,
    name: params.course,
  };

  const summary = await getCourseSummary(params.course);
  const student = summary.find((s) => s.id === params.student) || null;
  const detail = await getCourseDetail(params.course, params.student);

  const modulos = groupByModules(params.course, detail?.recursos || []);

  return { props: { course, student, modulos } };
}

// ---------- Íconos por tipo de recurso (estilo Q10) ----------
const TIPOS = {
  video: { label: 'Video', color: '#e5484d', d: 'M3 7h11v10H3z M14 10l7-3v10l-7-3' },
  texto: { label: 'Texto', color: '#4aa3e0', d: 'M6 3h8l5 5v13H6z M14 3v5h5 M9 13h7 M9 17h7' },
  audio: { label: 'Audio', color: '#1f7a7a', d: 'M4 9v6h4l5 4V5L8 9z M16 9a4 4 0 010 6 M18.5 6.5a8 8 0 010 11' },
  archivo: { label: 'Archivo', color: '#d9a21b', d: 'M20 11l-8 8a5 5 0 01-7-7l8-8a3.5 3.5 0 015 5l-8 8a2 2 0 01-3-3l7-7' },
  foro: { label: 'Foro', color: '#7c5cd6', d: 'M4 5h16v11H9l-5 4z' },
  iframe: { label: 'Actividad', color: '#e0762b', d: 'M8 7l-5 5 5 5 M16 7l5 5-5 5 M13.5 5l-3 14' },
  tarea: { label: 'Tarea', color: '#2f9e6b', d: 'M9 3h6v3H9z M6 5h12v16H6z M9 12l2 2 4-4' },
};

function tipoMeta(tipo) {
  const key = String(tipo || '').toLowerCase();
  return TIPOS[key] || { label: tipo || 'Recurso', color: '#667085', d: 'M6 3h12v18H6z' };
}

function TipoIcon({ d, color }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Avatar() {
  return (
    <svg viewBox="0 0 120 140" className="sp-avatar-img" aria-hidden="true">
      <rect width="120" height="140" fill="#f1f1f1" />
      <circle cx="60" cy="52" r="26" fill="#c9c9c9" />
      <path d="M8 140c0-34 22-52 52-52s52 18 52 52z" fill="#c9c9c9" />
    </svg>
  );
}

const COMPLETADOS = ['finalizado', 'realizado', 'entregada'];
const isDone = (estado) => COMPLETADOS.includes(String(estado || '').toLowerCase());

// "05/29/2026 17:39:42" (mes/día/año) -> "29/05/2026 17:39"
function formatFecha(raw) {
  const m = String(raw || '').match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}:\d{2}))?/);
  if (!m) return raw || '';
  return `${m[2]}/${m[1]}/${m[3]}${m[4] ? ' ' + m[4] : ''}`;
}

function ResourceCard({ r }) {
  const meta = tipoMeta(r.tipo);
  const done = isDone(r.estado);
  const fecha = formatFecha(r.fechaEntrega);
  const evaluacion = r.evaluacion === '' || r.evaluacion === null ? '' : String(r.evaluacion);

  return (
    <div className="sp-resource">
      <div className="sp-resource-main">
        <div className="sp-resource-type" style={{ color: meta.color }}>
          <TipoIcon d={meta.d} color={meta.color} />
          {meta.label}
        </div>
        <div className="sp-resource-name">{r.nombre}</div>
      </div>

      <div className="sp-resource-col">
        <span className={`status ${done ? 'done' : 'pending'}`}>
          <span className="status-dot" />
          {r.estado}
        </span>
        {r.aproximado && <span className="sp-approx" title="Estado aproximado por módulo">*</span>}
        <div className="sp-resource-col-label">Estado</div>
      </div>

      <div className="sp-resource-col">
        <div className="sp-resource-col-value">{done ? '100 %' : '0 %'}</div>
        <div className="sp-resource-col-label">Progreso</div>
      </div>

      <div className="sp-resource-col sp-resource-extra">
        {fecha || evaluacion ? (
          <>
            {fecha && <div className="sp-resource-col-value sp-small">{fecha}</div>}
            {fecha && <div className="sp-resource-col-label">Fecha de entrega</div>}
            {evaluacion && <div className="sp-resource-eval">{evaluacion}</div>}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function StudentDetail({ course, student, modulos }) {
  if (!student) {
    return (
      <div className="container">
        <Link href={`/dashboard/${course.slug}`} className="back-link">
          Volver a {course.name}
        </Link>
        <p>No se encontró este estudiante.</p>
      </div>
    );
  }

  const todos = modulos.flatMap((m) => m.recursos);
  const completados = todos.filter((r) => isDone(r.estado)).length;
  const progreso = Math.max(0, Math.min(100, Number(student.progreso) || 0));
  const hayAproximados = todos.some((r) => r.aproximado);

  return (
    <div className="container">
      <Link href={`/dashboard/${course.slug}`} className="back-link">
        Volver a {course.name}
      </Link>

      <h2 className="sp-page-title">Progreso del estudiante</h2>

      <div className="sp-profile">
        <div className="sp-avatar">
          <Avatar />
        </div>
        <div className="sp-profile-info">
          <h1 className="sp-name">{student.nombreCompleto || student.nombre}</h1>

          <div className="sp-line">
            <span className="sp-line-label">Progreso del curso:</span>
            <span className="sp-bar">
              <span className="sp-bar-fill" style={{ width: `${progreso}%` }} />
              <span className="sp-bar-text">{progreso}%</span>
            </span>
          </div>
          <div className="sp-line">
            <span className="sp-line-label">Último acceso:</span> {student.ultimoAcceso || '—'}
          </div>
          <div className="sp-line">
            <span className="sp-line-label">Tiempo total:</span> {student.tiempoTotal || '—'}
          </div>
          <div className="sp-line">
            <span className="sp-line-label">Promedio final:</span> {student.promedioFinal || '—'}
          </div>

          <div className="sp-contact">
            <div>
              <span className="sp-line-label">Identificación:</span> {student.idDisplay}
            </div>
            {student.correo && (
              <div>
                <span className="sp-line-label">Correo:</span> {student.correo}
              </div>
            )}
            {student.celular && (
              <div>
                <span className="sp-line-label">Celular:</span> {student.celular}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="muted sp-summary">
        {course.name} · {completados} de {todos.length} recursos completados
      </p>

      {hayAproximados && (
        <p className="sp-approx-note">
          * En este curso el informe de Q10 repite el nombre de algunos recursos en varios módulos y no
          indica a cuál corresponde cada uno. Para este estudiante, el estado de esos recursos por módulo
          es aproximado (se asume que avanzó en orden). El total de recursos completados es exacto.
        </p>
      )}

      {modulos.map((m, idx) => {
        const hechos = m.recursos.filter((r) => isDone(r.estado)).length;
        return (
          <section key={idx} className="sp-module">
            <div className="sp-module-header">
              <span>{m.nombre || 'Recursos del curso'}</span>
              <span className="sp-module-count">
                {hechos} de {m.recursos.length} completados
              </span>
            </div>
            {m.recursos.map((r, i) => (
              <ResourceCard key={i} r={r} />
            ))}
          </section>
        );
      })}
    </div>
  );
}
