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
        - receiptDate (string)
        
        If a value is not found, return an empty string. 
        Receipt Text: ${rawVisionText}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
}