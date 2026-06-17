import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize Gemini (Use an API Key from Google AI Studio)
const genAI = new GoogleGenerativeAI(process.env.gooogleGeminiApiKey || '');
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
                totalPrice: { type: SchemaType.STRING },
                buyerTaxId: { type: SchemaType.STRING },
                vendorTaxId: { type: SchemaType.STRING },
                vendorName: { type: SchemaType.STRING },
                receiptNumber: { type: SchemaType.STRING },
                receiptDate: { type: SchemaType.STRING },
            },
        }
    }
});

export async function parseInvoiceWithAI(rawVisionText: string) {
    const prompt = `
        Extract the following information from this receipt text:
        - totalPrice (string)
        - receiptNumber (string)
        - buyerTaxId (string)
        - vendorTaxId (string)
        - vendorName (string)
        - receiptDate (string, format: YYYY-MM-DD)
        
        If a value is not found, return an empty string. 
        Receipt Text: ${rawVisionText}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        return JSON.parse(response.text());
    } catch (error: unknown) {
        console.error("Gemini AI Error:", error);

        const err = error as { status?: number; message?: string };

        // Check for 429 Quota Exceeded (Daily Limit)
        if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota") || err?.message?.includes("limit exceeded")) {
            const quotaError = new Error("Você excedeu o limite diário de uso da IA. Por favor, tente novamente outro dia.");
            (quotaError as { status?: number }).status = 500;
            throw quotaError;
        }

        // Check specifically for 503 Service Unavailable or high demand strings
        if (err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("high demand")) {
            const serviceError = new Error("O serviço de IA está com alta demanda. Por favor, tente novamente em instantes.");
            (serviceError as { status?: number }).status = 500;
            throw serviceError;
        }

        return {
            totalPrice: '',
            buyerTaxId: '',
            vendorTaxId: '',
            vendorName: '',
            receiptNumber: '',
            receiptDate: '',
        };
    }
}