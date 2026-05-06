import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { QuotationPDF } from "@/lib/pdf/quotation-pdf";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      company: true,
      customer: true,
      items: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!quotation) {
    return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
  }

  const pdfData = {
    quotationNumber: quotation.quotationNumber,
    title: quotation.title,
    date: quotation.date.toISOString().split("T")[0],
    company: quotation.company,
    customer: quotation.customer,
    items: quotation.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    subtotal: quotation.subtotal,
    discount: quotation.discount,
    taxRate: quotation.taxRate,
    taxAmount: quotation.taxAmount,
    grandTotal: quotation.grandTotal,
    terms: quotation.terms,
    warranty: quotation.warranty,
    footer: quotation.footer,
    validity: quotation.validity,
    salesPerson: quotation.salesPerson,
    salesPhone: quotation.salesPhone,
    salesEmail: quotation.salesEmail,
    fontFamily: quotation.fontFamily,
    currency: quotation.currency,
  };

  const buffer = await renderToBuffer(
    QuotationPDF({ data: pdfData })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${quotation.quotationNumber}.pdf"`,
    },
  });
}
