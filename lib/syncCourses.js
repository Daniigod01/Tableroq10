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
  saveCourseDetail,
  saveCourseList,
  saveLastSync,
  saveLastSyncError,
  clearLastSyncError,
} from './dataStore';

// Lógica central de sincronización con Google Drive. La usan tanto el
// cron externo (pages/api/cron/sync.js, autenticado con CRON_SECRET) como
// el botón "Actualizar ahora" del dashboard (pages/api/sync-now.js,
// autenticado con la sesión del usuario logueado).
export async function runSync() {
  const rootFolderId = process.env.DRIVE_FOLDER_ID;
  if (!rootFolderId) {
    throw new Error('Falta la variable DRIVE_FOLDER_ID');
  }

  const drive = await getDriveClient();
  const subfolders = await listSubfolders(drive, rootFolderId);

  const courseList = [];
  const skipped = [];

  for (const folder of subfolders) {
    const listadoFile = await findFileInFolder(drive, folder.id, 'listado_de_usuarios');
    const informeFile = await findFileInFolder(drive, folder.id, 'informe_de_progreso');

    if (!listadoFile || !informeFile) {
      skipped.push(folder.name);
      continue;
    }

    const [listadoBuffer, informeBuffer] = await Promise.all([
      downloadFileBuffer(drive, listadoFile.id),
      downloadFileBuffer(drive, informeFile.id),
    ]);

    const summaryRows = parseListadoUsuarios(listadoBuffer);
    const detailMap = parseInformeProgreso(informeBuffer);
    const merged = mergeCourseData(summaryRows, detailMap);

    const slug = slugify(folder.name);

    await saveCourseSummary(slug, merged);

    for (const [studentId, detail] of detailMap.entries()) {
      await saveCourseDetail(slug, studentId, detail);
    }

    const avgProgreso = merged.length
      ? Math.round(merged.reduce((acc, s) => acc + (s.progreso || 0), 0) / merged.length)
      : 0;
    const finalizados = merged.filter((s) => s.progreso === 100).length;

    courseList.push({
      slug,
      name: folder.name,
      totalEstudiantes: merged.length,
      avgProgreso,
      finalizados,
    });
  }

  await saveCourseList(courseList);
  await saveLastSync(Date.now());
  await clearLastSyncError();

  return { courseList, skipped };
}

// Envoltorio que además registra el error en KV (para mostrarlo en el
// dashboard) antes de relanzarlo.
export async function runSyncAndTrackErrors() {
  try {
    return await runSync();
  } catch (err) {
    await saveLastSyncError(String(err.message || err));
    throw err;
  }
}
