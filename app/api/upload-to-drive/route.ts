import { NextRequest, NextResponse } from 'next/server';

import { validateSession } from '@/app/lib/server/session';
import { getOrCreateFolder, uploadFile } from '@/app/lib/server/googleDrive';

export async function POST(request: NextRequest) {
  try {
    // 1. Session Validation
    const isAuthenticated = await validateSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse JSON from the request
    const { fileData, fileName, fileType } = await request.json()

    if (!fileData || !fileName || !fileType) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const folder = await getOrCreateFolder('TEMP', process.env.googleFolderId);

    // 3. Upload to Google Drive
    const response = await uploadFile(fileData, fileName, fileType, folder.id || '');

    if (!response.id) {
      console.error("Failed to upload file", response);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      fileId: response.id,
    }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error"
    }, { status: 500 });
  }
}