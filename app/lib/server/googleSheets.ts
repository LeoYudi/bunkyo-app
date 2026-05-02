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

export async function appendContentToSheet({ sheetId, rows }: { sheetId: string, rows: string[][] }) {
    return await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
            requests: [
                {
                    appendCells: {
                        sheetId: 0,
                        rows: rows.map(row => ({
                            values: row.map(cellValue => ({
                                userEnteredValue: { stringValue: cellValue }
                            }))
                        })),
                        fields: 'userEnteredValue'
                    }
                }
            ]
        }
    })
}