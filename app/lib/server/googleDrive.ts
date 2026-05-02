import { google } from 'googleapis';
import { Readable } from 'stream';

import { auth } from './googleAuth';

const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder'
const SPREADSHEET_MIME_TYPE = 'application/vnd.google-apps.spreadsheet'

export const drive = google.drive({ version: 'v3', auth });

export async function getOrCreateFolder(folderName: string, parentId?: string) {
  // 1. Build the query
  // 'trashed = false' ignores deleted folders
  let query = `name = '${folderName}' and mimeType = '${FOLDER_MIME_TYPE}' and trashed = false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  // 2. Search for existing folder
  const res = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
    spaces: 'drive',
  });
  const existingFolder = res.data.files?.[0];
  if (existingFolder) {
    return existingFolder;
  }

  // 3. Create if it doesn't exist
  const createRes = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : [],
    },
    fields: 'id',
  });

  return createRes.data;
}

export async function uploadFile(fileData: string, fileName: string, fileType: string, folderId: string) {
  if (!folderId) {
    throw new Error('Folder ID is required');
  }

  const buffer = Buffer.from(fileData, 'base64');
  const response = await drive.files.create({
    supportsAllDrives: true,
    enforceSingleParent: true,
    requestBody: {
      name: fileName,
      mimeType: fileType,
      parents: [folderId],
    },
    media: {
      mimeType: fileType,
      body: Readable.from(buffer),
    },
  });

  return response.data;
}

export async function getSheetFromFolder(folderId: string) {
  const res = await drive.files.list({
    q: `mimeType = '${SPREADSHEET_MIME_TYPE}' and name contains 'template' and trashed = false and '${folderId}' in parents`,
    fields: 'files(id, name)',
  });

  if (!res.data.files?.length) {
    return ''
  }

  return res.data.files[0]?.id || '';
}