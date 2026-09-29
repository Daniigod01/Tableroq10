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
