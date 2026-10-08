import { kv } from '@vercel/kv';

export async function saveCourseList(courses) {
  await kv.set('courses:list', courses);
}

export async function getCourseList() {
  return (await kv.get('courses:list')) || [];
}

export async function saveCourseSummary(slug, students) {
  await kv.set(`course:${slug}:summary`, students);
}

export async function getCourseSummary(slug) {
  return (await kv.get(`course:${slug}:summary`)) || [];
}

export async function saveCourseDetail(slug, studentId, detail) {
  await kv.set(`course:${slug}:detail:${studentId}`, detail);
}

// Guarda el detalle de todos los estudiantes de un curso en lotes (pipeline)
// para evitar miles de llamadas secuenciales y el timeout de 60 s.
export async function saveCourseDetails(slug, detailMap) {
  const entries = [...detailMap.entries()];
  for (let i = 0; i < entries.length; i += 50) {
    const p = kv.pipeline();
    for (const [id, d] of entries.slice(i, i + 50)) {
      p.set(`course:${slug}:detail:${id}`, d);
    }
    await p.exec();
  }
}

export async function getCourseDetail(slug, studentId) {
  return (await kv.get(`course:${slug}:detail:${studentId}`)) || null;
}

export async function saveLastSync(timestamp) {
  await kv.set('sync:lastRun', timestamp);
}

export async function getLastSync() {
  return (await kv.get('sync:lastRun')) || null;
}

export async function saveLastSyncError(message) {
  await kv.set('sync:lastError', { message, at: Date.now() });
}

export async function clearLastSyncError() {
  await kv.del('sync:lastError');
}

export async function getLastSyncError() {
  return (await kv.get('sync:lastError')) || null;
}
