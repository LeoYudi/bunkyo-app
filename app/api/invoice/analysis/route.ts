import { NextResponse } from 'next/server';
import { analyseInvoice } from "@/app/lib/server/googleVision";

export async function POST(request: Request) {
    try {
        const { base64, mimeType } = await request.json();
        const invoiceData = await analyseInvoice({ base64, mimeType });
        return NextResponse.json({
            data: invoiceData
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, { status: 500 });
    }
}