import { runSyncAndTrackErrors } from '../../../lib/syncCourses';

// El cron externo (cron-job.org) se configura para enviar el header
// "Authorization: Bearer <CRON_SECRET>" en cada llamada (ver README.md,
// sección 6). Esto evita que cualquiera pueda disparar la sincronización
// llamando a esta URL desde fuera.
function isAuthorized(req) {
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  return req.headers.authorization === expected;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    res.status(401).json({ ok: false, message: 'No autorizado' });
    return;
  }

  try {
    const { courseList, skipped } = await runSyncAndTrackErrors();
    res.status(200).json({
      ok: true,
      cursosActualizados: courseList,
      carpetasOmitidas: skipped,
    });
  } catch (err) {
    console.error('Error en sincronización con Drive:', err);
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
}
