import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';

import { validateSession } from '@/app/lib/server/session';
import { appendContentToSheet, getSheetContent, updateSheetRow } from '@/app/lib/server/googleSheets';
import { getOrCreateFolder, getSheetFromFolder, uploadFile } from '@/app/lib/server/googleDrive';

export async function POST(request: NextRequest) {
  try {
    // 1. Session Validation
    const isAuthenticated = await validateSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Sessão expirada ou não autorizada." }, { status: 401 });
    }

    // 2. Parse JSON from the request
    const { fileData, fileName, fileType, invoiceData } = await request.json()

    if (!fileData || !fileName || !fileType || !invoiceData) {
      return NextResponse.json({ error: "Dados incompletos para upload." }, { status: 400 });
    }

    // 3. Drive Upload
    let driveResponse: { id?: string | null };
    try {
      const folder = await getOrCreateFolder('TEMP', process.env.googleFolderId);
      driveResponse = await uploadFile(fileData, fileName, fileType, folder.id || '');

      if (!driveResponse.id) {
        throw new Error("Resposta do Google Drive sem ID de arquivo.");
      }
    } catch (driveError: unknown) {
      console.error("Drive Upload Error:", driveError);
      const message = driveError instanceof Error ? driveError.message : "Erro desconhecido";
      return NextResponse.json({
        error: `Erro ao salvar arquivo no Google Drive: ${message}`
      }, { status: 500 });
    }

    // 4. Google Sheets Logging
    try {
      const spreadsheetId = await getSheetFromFolder(process.env.googleFolderId || '');

      if (!spreadsheetId) {
        throw new Error("Planilha de registro não encontrada no Google Drive.");
      }

      // Fetch current content to find the first available row with an ID
      const sheetData = await getSheetContent(spreadsheetId);
      const values = sheetData.data.values || [];

      // Find the first row where column A (ID) has data but column B is empty
      // We skip the first few rows (headers and empty space)
      let targetRowIndex = -1;
      for (let i = 0; i < values.length; i++) {
        const row = values[i];
        if (row && row[0] && row[0] !== "" && (row.length < 2)) {
          // Additional check: ensure it's not a header row
          targetRowIndex = i + 1; // Sheets API is 1-indexed
          break;
        }
      }
      // Validate date before formatting
      const rDate = dayjs(invoiceData.receiptDate);
      const formattedDate = rDate.isValid() ? rDate.format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY');

      if (targetRowIndex === -1) {
        // Fallback to appending if no pre-numbered row is found
        await appendContentToSheet({
          sheetId: spreadsheetId,
          rows: [
            [
              "",
              "",
              "",
              formattedDate,
              invoiceData.vendorName,
              invoiceData.receiptNumber,
              "",
              invoiceData.totalPrice,
            ]
          ]
        });
      } else {
        // Update the specific row
        const sheetTitle = sheetData.data.range?.split('!')[0] || 'Plan1';
        const range = `${sheetTitle}!A${targetRowIndex}`;

        await updateSheetRow({
          sheetId: spreadsheetId,
          range: range,
          values: [
            [
              values[targetRowIndex - 1][0], // Keep existing ID
              "", // Column B empty as requested
              "", // Column C empty
              formattedDate, // Col D
              invoiceData.vendorName, // Col E
              invoiceData.receiptNumber, // Col F
              "", // Col G
              invoiceData.totalPrice, // Col H
            ]
          ]
        });
      }
    } catch (sheetsError: unknown) {
      console.error("Sheets Logging Error:", sheetsError);
      const message = sheetsError instanceof Error ? sheetsError.message : "Erro desconhecido";
      return NextResponse.json({
        error: `Arquivo salvo, mas erro ao registrar na planilha: ${message}`
      }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        fileUrl: `https://drive.google.com/file/d/${driveResponse.id}`,
      }
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("General Upload API Error:", error);
    const message = error instanceof Error ? error.message : "Erro interno ao processar o upload.";
    return NextResponse.json({
      error: message
    }, { status: 500 });
  }
}