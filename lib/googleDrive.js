import { google } from 'googleapis';

function getCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
  if (!raw) {
    throw new Error(
      'Falta la variable de entorno GOOGLE_SERVICE_ACCOUNT_BASE64 (ver README.md).'
    );
  }
  return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
}

export async function getDriveClient() {
  const credentials = getCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  return google.drive({ version: 'v3', auth });
}

// Lista las subcarpetas directas de una carpeta (una subcarpeta = un curso)
export async function listSubfolders(drive, parentId) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name, modifiedTime)',
    pageSize: 100,
  });
  return res.data.files || [];
}

// Busca, dentro de una carpeta, el archivo MÁS RECIENTE cuyo nombre contenga
// el texto indicado (ignora mayúsculas/minúsculas y trata espacios, guiones
// y guiones bajos como equivalentes, así "Listado de usuarios (4).xlsx"
// también coincide con "listado_de_usuarios").
export async function findFileInFolder(drive, folderId, namePattern) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
    orderBy: 'modifiedTime desc',
    fields: 'files(id, name, modifiedTime, mimeType)',
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  const norm = (s) => String(s).toLowerCase().replace(/[\s_-]+/g, '_');
  const files = res.data.files || [];
  return files.find((f) => norm(f.name).includes(norm(namePattern)));
}

export async function downloadFileBuffer(drive, fileId) {
  const res = await drive.files.get(
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(res.data);
}
