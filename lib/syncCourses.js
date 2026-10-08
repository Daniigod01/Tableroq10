import {
  getDriveClient,
  listSubfolders,
  findFileInFolder,
  downloadFileBuffer,
} from './googleDrive';
import {
  parseListadoUsuarios,
  parseInformeProgreso,
  mergeCourseData,
  slugify,
} from './excelParser';
import {
  saveCourseSummary,
  saveCourseDetails,
  saveCourseList,
  saveCourseMeta,
  getCourseMeta,
  saveLastSync,
  saveLastSyncError,
  clearLastSyncError,
} from './dataStore';

// Lógica central de sincronización con Google Drive. La usan tanto el
// cron externo (pages/api/cron/sync.js, autenticado con CRON_SECRET) como
// el botón "Actualizar ahora" del dashboard (pages/api/sync-now.js,
// autenticado con la sesión del usuario logueado).
//
// Para no tardar de más, cada curso guarda una "firma" de sus dos archivos
// de Drive (id + fecha de modificación). Si la firma no cambió desde la
// última sincronización, el curso se salta (no se descarga ni se procesa
// de nuevo). Con { force: true } se reprocesan todos los cursos.
export async function runSync({ force = false } = {}) {
  const rootFolderId = process.env.DRIVE_FOLDER_ID;
  if (!rootFolderId) {
    throw new Error('Falta la variable DRIVE_FOLDER_ID');
  }

  const drive = await getDriveClient();
  const subfolders = await listSubfolders(drive, rootFolderId);

  const courseList = [];
  const skipped = []; // carpetas sin los dos archivos
  const unchanged = []; // cursos sin cambios (saltados)
  const updated = []; // cursos reprocesados

  for (const folder of subfolders) {
    const listadoFile = await findFileInFolder(drive, folder.id, 'listado_de_usuarios');
    const informeFile = await findFileInFolder(drive, folder.id, 'informe_de_progreso');

    if (!listadoFile || !informeFile) {
      skipped.push(folder.name);
      continue;
    }

    const slug = slugify(folder.name);
    const sig =
      `${listadoFile.id}:${listadoFile.modifiedTime}|` +
      `${informeFile.id}:${informeFile.modifiedTime}`;

    if (!force) {
      const meta = await getCourseMeta(slug);
      if (meta && meta.sig === sig && meta.entry) {
        courseList.push({ ...meta.entry, name: folder.name });
        unchanged.push(folder.name);
        continue;
      }
    }

    const [listadoBuffer, informeBuffer] = await Promise.all([
      downloadFileBuffer(drive, listadoFile.id),
      downloadFileBuffer(drive, informeFile.id),
    ]);

    const summaryRows = parseListadoUsuarios(listadoBuffer);
    const detailMap = parseInformeProgreso(informeBuffer);
    const merged = mergeCourseData(summaryRows, detailMap);

    await saveCourseSummary(slug, merged);
    await saveCourseDetails(slug, detailMap);

    const avgProgreso = merged.length
      ? Math.round(merged.reduce((acc, s) => acc + (s.progreso || 0), 0) / merged.length)
      : 0;
    const finalizados = merged.filter((s) => s.progreso === 100).length;

    const entry = {
      slug,
      name: folder.name,
      totalEstudiantes: merged.length,
      avgProgreso,
      finalizados,
    };

    // La firma se guarda al final: si la sincronización se interrumpe antes,
    // el curso se vuelve a procesar en la próxima pasada.
    await saveCourseMeta(slug, { sig, entry });

    courseList.push(entry);
    updated.push(folder.name);
  }

  await saveCourseList(courseList);
  await saveLastSync(Date.now());
  await clearLastSyncError();

  return { courseList, skipped, unchanged, updated };
}

// Envoltorio que además registra el error en KV (para mostrarlo en el
// dashboard) antes de relanzarlo.
export async function runSyncAndTrackErrors(options) {
  try {
    return await runSync(options);
  } catch (err) {
    await saveLastSyncError(String(err.message || err));
    throw err;
  }
}
