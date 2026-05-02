import { google } from "googleapis";

import { auth } from "./googleAuth";
import { parseInvoiceWithAI } from "./googleGemini";

const vision = google.vision({ version: 'v1', auth: auth });

export async function analyseInvoice({ base64, mimeType }: { base64: string, mimeType: string }) {
    let response: any;

    if (mimeType.includes('image')) {
        response = await vision.images.annotate({
            requestBody: {
                requests: [
                    {
                        image: {
                            content: base64
                        },
                        features: [
                            {
                                type: 'DOCUMENT_TEXT_DETECTION'
                            }
                        ]
                    }
                ]
            }
        })
    }

    if (mimeType.includes('pdf')) {
        response = await vision.files.annotate({
            requestBody: {
                requests: [
                    {
                        inputConfig: {
                            content: base64,
                            mimeType: 'application/pdf',
                        },
                        features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
                        // For synchronous calls, you can only request specific pages
                        pages: [1, 2]
                    }
                ]
            }
        });
    }

    if (!response) {
        throw new Error("Invalid mimeType")
    }

    if (!response.data.responses || !response.data.responses[0]) {
        console.error("Failed to get text from image:", JSON.stringify(response.data.responses));
        throw new Error("Failed to get text from image")
    }

    let fullText = "";

    if (response.data.responses[0]?.responses) {
        fullText = response.data.responses?.[0].responses?.[0].fullTextAnnotation?.text;
    }

    else {
        fullText = response.data.responses[0].fullTextAnnotation?.text;
    }

    return parseInvoiceWithAI(fullText);
}

// Helper: Extract the highest currency-like value (usually the Total)
function extractTotal(text: string): string | null {
    const prices = text.match(/\d+[.,]\d{2}/g);
    if (!prices) return null;
    // Convert to numbers and find the maximum (Total is usually the largest number)
    const numericPrices = prices.map(p => parseFloat(p.replace(',', '.')));
    return Math.max(...numericPrices).toString();
}

// Helper: Generic Regex extractor
function extractRegex(text: string, regex: RegExp): string | null {
    const match = text.match(regex);
    return match ? match[0] : null;
}