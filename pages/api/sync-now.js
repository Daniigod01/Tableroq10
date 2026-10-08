import { checkAuth } from '../../lib/requireAuth';
import { runSyncAndTrackErrors } from '../../lib/syncCourses';

// Este endpoint hace lo mismo que el cron (pages/api/cron/sync.js), pero
// se autentica con la cookie de sesión del dashboard en lugar del
// CRON_SECRET, para que el botón "Actualizar ahora" pueda llamarlo desde
// el navegador del usuario ya logueado.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Método no permitido' });
    return;
  }

  if (!checkAuth(req)) {
    res.status(401).json({ ok: false, message: 'No autorizado' });
    return;
  }

  try {
    // ?force=1 reprocesa todos los cursos aunque sus archivos no hayan cambiado
    const force = req.query.force === '1';
    const { courseList, skipped, unchanged, updated } = await runSyncAndTrackErrors({ force });
    res.status(200).json({
      ok: true,
      cursosActualizados: courseList,
      carpetasOmitidas: skipped,
      cursosSinCambios: unchanged,
      cursosReprocesados: updated,
    });
  } catch (err) {
    console.error('Error en sincronización manual:', err);
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
}
