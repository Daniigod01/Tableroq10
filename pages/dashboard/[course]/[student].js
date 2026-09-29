import Link from 'next/link';
import { checkAuth } from '../../../lib/requireAuth';
import { getCourseDetail, getCourseSummary, getCourseList } from '../../../lib/dataStore';

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

  return {
    props: {
      course,
      student,
      resources: detail?.recursos || [],
    },
  };
}

function ProgressRing({ percent }) {
  const size = 96;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="record-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e3e8ef"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#1b5fae"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="record-ring-pct">
        {percent}%
      </text>
    </svg>
  );
}

export default function StudentDetail({ course, student, resources }) {
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

  const finalizados = resources.filter((r) => r.estado === 'Finalizado').length;

  return (
    <div className="container">
      <Link href={`/dashboard/${course.slug}`} className="back-link">
        Volver a {course.name}
      </Link>
      <p className="muted" style={{ marginBottom: 4 }}>{course.name}</p>
      <h1>{student.nombreCompleto || student.nombre}</h1>

      <div className="record-card">
        <ProgressRing percent={student.progreso} />
        <dl className="record-fields">
          <div className="record-field">
            <dt>Identificación</dt>
            <dd>{student.idDisplay}</dd>
          </div>
          <div className="record-field">
            <dt>Promedio final</dt>
            <dd>{student.promedioFinal}</dd>
          </div>
          <div className="record-field">
            <dt>Correo</dt>
            <dd>{student.correo}</dd>
          </div>
          <div className="record-field">
            <dt>Celular</dt>
            <dd>{student.celular}</dd>
          </div>
          <div className="record-field">
            <dt>Tiempo total</dt>
            <dd>{student.tiempoTotal}</dd>
          </div>
          <div className="record-field">
            <dt>Último acceso</dt>
            <dd>{student.ultimoAcceso}</dd>
          </div>
        </dl>
      </div>

      <h2>
        Detalle por recurso <span className="muted">({finalizados} de {resources.length} finalizados)</span>
      </h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nombre del recurso</th>
              <th>Estado</th>
              <th>Fecha de entrega</th>
              <th>Evaluación</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r, i) => {
              const done = r.estado === 'Finalizado';
              return (
                <tr key={i}>
                  <td>{r.tipo}</td>
                  <td>{r.nombre}</td>
                  <td>
                    <span className={`status ${done ? 'done' : 'pending'}`}>
                      <span className="status-dot" />
                      {r.estado}
                    </span>
                  </td>
                  <td>{r.fechaEntrega}</td>
                  <td>{r.evaluacion}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
