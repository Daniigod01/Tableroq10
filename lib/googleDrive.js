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

// Busca, dentro de una carpeta, el primer archivo cuyo nombre contenga el
// texto indicado (sin importar mayúsculas/minúsculas)
export async function findFileInFolder(drive, folderId, namePattern) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, modifiedTime, mimeType)',
    pageSize: 50,
  });
  const files = res.data.files || [];
  return files.find((f) => f.name.toLowerCase().includes(namePattern.toLowerCase()));
}

export async function downloadFileBuffer(drive, fileId) {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(res.data);
}
