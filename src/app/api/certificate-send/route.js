import { NextResponse } from "next/server";
import CertificateServerSide from "@/components/pdfcom/Certificates/CertificateComServerSide";
import { renderToBuffer } from "@react-pdf/renderer";
import RegFormPdf from "@/components/pdfcom/MemberRegFormPdf/RegFromPdf";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  try {
    const { memberData, selectedProgram,isRegForm=false } = await req.json();

      let buffer;
    // ✅ CORRECT BUFFER
    if(isRegForm){
     buffer = await renderToBuffer(
      <RegFormPdf
        data={memberData}
        selectedProgram={selectedProgram}
      />
    );
    }else{
     buffer = await renderToBuffer(
      <CertificateServerSide
        data={memberData}
        selectedProgram={selectedProgram}
      />
    );
    
    }

    // 🔍 Debug (optional)
    console.log("PDF buffer size:", buffer.length);

    return NextResponse.json(
      {
        base64: buffer.toString("base64"),
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("PDF generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500, headers: corsHeaders }
    );
  }
}
