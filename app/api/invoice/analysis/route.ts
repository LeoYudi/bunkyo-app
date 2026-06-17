import { NextResponse } from 'next/server';
import { analyseInvoice } from "@/app/lib/server/googleVision";

export async function POST(request: Request) {
    try {
        const { base64, mimeType } = await request.json();
        
        if (!base64 || !mimeType) {
            return NextResponse.json({ error: "Missing file data or mime type" }, { status: 400 });
        }

        const invoiceData = await analyseInvoice({ base64, mimeType });
        return NextResponse.json({
            data: invoiceData
        });
    } catch (error: unknown) {
        console.error("Analysis API Error:", error);
        
        const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao analisar a nota fiscal.";
        const status = (error as { status?: number })?.status || 500;

        return NextResponse.json({
            error: errorMessage
        }, { status });
    }
}