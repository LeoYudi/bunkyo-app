import { google } from "googleapis";

import { auth } from "./googleAuth";

const sheets = google.sheets({ version: "v4", auth });

export async function getSheetContent(sheetId: string) {
    return await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        // all values
        range: 'A:ZZ',
    });
}

export async function appendContentToSheet({ sheetId }: { sheetId: string, rows: string[][] }) {
    // 1. Fetch the spreadsheet metadata to find the available tabs
    const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
        // Include only the basic properties to keep the request fast and lightweight
        fields: 'sheets.properties.title',
    });

    // 2. Extract the title of the very first sheet in the document
    const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title;

    if (!firstSheetTitle) {
        throw new Error("Could not find any visible sheets in this document.");
    }

    return firstSheetTitle;
}

export async function updateSheetRow({ sheetId, range, values }: { sheetId: string, range: string, values: unknown[][] }) {
    return await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
            values: values as (string | number | boolean | null)[][], 
        }
    })
}