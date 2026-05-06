import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

function createStyles(fontFamily: string) {
  const bold = fontFamily === "Helvetica" ? "Helvetica-Bold" :
    fontFamily === "Times-Roman" ? "Times-Bold" :
    fontFamily === "Courier" ? "Courier-Bold" : "Helvetica-Bold";

  return StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily, color: "#1a1a1a" },
    headerCenter: { alignItems: "center", marginBottom: 15, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 6 },
    logo: { width: 50, height: 50, marginRight: 10 },
    companyName: { fontSize: 18, fontFamily: bold, color: "#111827", textTransform: "uppercase" },
    companyDetail: { fontSize: 9, color: "#6b7280", marginTop: 1, textAlign: "center" },
    companyDetailRow: { flexDirection: "row", justifyContent: "center", gap: 15, marginTop: 2 },
    regNo: { fontSize: 9, color: "#6b7280", marginTop: 2, textAlign: "center" },
    twoCol: { flexDirection: "row", marginBottom: 15, gap: 20 },
    leftCol: { flex: 1 },
    rightCol: { width: 200 },
    label: { fontSize: 8, color: "#9ca3af", textTransform: "uppercase", fontFamily: bold, marginBottom: 2 },
    customerName: { fontSize: 12, fontFamily: bold, color: "#111827" },
    customerDetail: { fontSize: 9, color: "#6b7280", marginTop: 1 },
    attn: { fontSize: 9, color: "#6b7280", marginTop: 4 },
    attnBold: { fontFamily: bold },
    quotationBox: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 4, padding: 8 },
    quotationTitle: { fontSize: 14, fontFamily: bold, color: "#2563eb", textAlign: "center", textTransform: "uppercase", marginBottom: 6 },
    quotationRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
    quotationLabel: { fontSize: 8, color: "#6b7280", fontFamily: bold },
    quotationValue: { fontSize: 8, color: "#111827" },
    quotationValueMono: { fontSize: 8, color: "#111827", fontFamily: "Courier" },
    titleBar: { backgroundColor: "#f3f4f6", padding: 6, borderRadius: 3, marginBottom: 12 },
    titleText: { fontSize: 11, fontFamily: bold, color: "#111827", textTransform: "uppercase" },
    table: { marginBottom: 15 },
    tableHeader: { flexDirection: "row", backgroundColor: "#1f2937", paddingVertical: 6, paddingHorizontal: 4 },
    tableHeaderCell: { fontSize: 8, fontFamily: bold, color: "#ffffff", textTransform: "uppercase" },
    tableRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb" },
    tableCell: { fontSize: 9, color: "#111827" },
    colNum: { width: "7%", textAlign: "center" },
    colDesc: { width: "38%", paddingLeft: 4 },
    colPrice: { width: "20%", textAlign: "right" },
    colQty: { width: "12%", textAlign: "center" },
    colTotal: { width: "23%", textAlign: "right" },
    totalsContainer: { alignItems: "flex-end", marginBottom: 15 },
    totalsBox: { width: 200 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb" },
    totalLabel: { fontSize: 9, color: "#6b7280", fontFamily: bold },
    totalValue: { fontSize: 9, fontFamily: bold },
    grandTotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 2, borderTopColor: "#111827", marginTop: 3 },
    grandTotalLabel: { fontSize: 12, fontFamily: bold },
    grandTotalValue: { fontSize: 12, fontFamily: bold },
    discountValue: { fontSize: 9, fontFamily: bold, color: "#dc2626" },
    termsLabel: { fontSize: 8, fontFamily: bold, color: "#374151", textTransform: "uppercase", marginBottom: 3 },
    termsText: { fontSize: 9, color: "#374151" },
    section: { marginBottom: 12 },
    footer: { borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 8, marginTop: 10 },
    footerText: { fontSize: 9, color: "#6b7280" },
    signaturesContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 40, gap: 30 },
    signatureBlock: { flex: 1, alignItems: "center" },
    signatureLine: { borderBottomWidth: 1, borderBottomColor: "#9ca3af", width: "100%", height: 30, marginBottom: 4 },
    signatureLabel: { fontSize: 8, color: "#6b7280", fontFamily: bold, textTransform: "uppercase" },
    signatureSubLabel: { fontSize: 7, color: "#9ca3af", marginTop: 1 },
    generatedNote: { textAlign: "center", fontSize: 7, color: "#9ca3af", marginTop: 15, borderTopWidth: 0.5, borderTopColor: "#e5e7eb", paddingTop: 8 },
  });
}

interface QuotationItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface Company {
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  registrationNo?: string | null;
}

interface Customer {
  name: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

interface QuotationPDFData {
  quotationNumber: string;
  title?: string | null;
  date: string;
  company: Company;
  customer: Customer;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  terms?: string | null;
  warranty?: string | null;
  footer?: string | null;
  validity?: number;
  salesPerson?: string | null;
  salesPhone?: string | null;
  salesEmail?: string | null;
  fontFamily?: string;
  currency?: string;
}

function currencySymbol(c?: string) {
  if (c === "USD") return "$";
  if (c === "EUR") return "\u20AC";
  if (c === "GBP") return "\u00A3";
  return "Rs.";
}

function fmt(n: number, c?: string): string {
  const sym = currencySymbol(c);
  return `${sym}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function QuotationPage({ data, copyLabel, styles }: { data: QuotationPDFData; copyLabel: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Company Header */}
      <View style={styles.headerCenter}>
        <View style={styles.headerRow}>
          {data.company.logoUrl && (
            /* eslint-disable-next-line jsx-a11y/alt-text */
            <Image src={data.company.logoUrl} style={styles.logo} />
          )}
          <Text style={styles.companyName}>{data.company.name}</Text>
        </View>
        {data.company.address && <Text style={styles.companyDetail}>{data.company.address}</Text>}
        <View style={styles.companyDetailRow}>
          {data.company.phone && <Text style={styles.companyDetail}>Tel: {data.company.phone}</Text>}
          {data.company.email && <Text style={styles.companyDetail}>Email: {data.company.email}</Text>}
        </View>
        {data.company.registrationNo && (
          <Text style={styles.regNo}>REG NO: {data.company.registrationNo}</Text>
        )}
      </View>

      {/* Two Column: Customer + Quotation Box */}
      <View style={styles.twoCol}>
        <View style={styles.leftCol}>
          <Text style={styles.label}>TO:</Text>
          <Text style={styles.customerName}>{data.customer.name}</Text>
          {data.customer.address && <Text style={styles.customerDetail}>{data.customer.address}</Text>}
          {data.customer.phone && <Text style={styles.customerDetail}>Tel: {data.customer.phone}</Text>}
          {data.customer.email && <Text style={styles.customerDetail}>Email: {data.customer.email}</Text>}
          {data.customer.contactPerson && (
            <Text style={styles.attn}>
              <Text style={styles.attnBold}>ATTN: </Text>{data.customer.contactPerson}
            </Text>
          )}
        </View>
        <View style={styles.rightCol}>
          <View style={styles.quotationBox}>
            <Text style={styles.quotationTitle}>Quotation</Text>
            <View style={styles.quotationRow}>
              <Text style={styles.quotationLabel}>NO:</Text>
              <Text style={styles.quotationValueMono}>{data.quotationNumber}</Text>
            </View>
            <View style={styles.quotationRow}>
              <Text style={styles.quotationLabel}>DATE:</Text>
              <Text style={styles.quotationValue}>{data.date}</Text>
            </View>
            <View style={styles.quotationRow}>
              <Text style={styles.quotationLabel}>VALIDITY:</Text>
              <Text style={styles.quotationValue}>{data.validity || 30} DAYS</Text>
            </View>
            {data.salesPerson && (
              <View style={styles.quotationRow}>
                <Text style={styles.quotationLabel}>SALES:</Text>
                <Text style={styles.quotationValue}>{data.salesPerson}</Text>
              </View>
            )}
            {data.salesPhone && (
              <View style={styles.quotationRow}>
                <Text style={styles.quotationLabel}>TEL:</Text>
                <Text style={styles.quotationValue}>{data.salesPhone}</Text>
              </View>
            )}
            {data.salesEmail && (
              <View style={styles.quotationRow}>
                <Text style={styles.quotationLabel}>EMAIL:</Text>
                <Text style={styles.quotationValue}>{data.salesEmail}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Title */}
      {data.title && (
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>QUOTATION FOR {data.title}</Text>
        </View>
      )}

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colNum]}>No</Text>
          <Text style={[styles.tableHeaderCell, styles.colDesc]}>Item / Components</Text>
          <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
          <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderCell, styles.colTotal]}>Sub Total</Text>
        </View>
        {data.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colNum]}>{i + 1}</Text>
            <Text style={[styles.tableCell, styles.colDesc]}>{item.description || "-"}</Text>
            <Text style={[styles.tableCell, styles.colPrice]}>{fmt(item.unitPrice, data.currency)}</Text>
            <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, styles.colTotal]}>{fmt(item.total, data.currency)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{fmt(data.subtotal, data.currency)}</Text>
          </View>
          {data.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.discountValue}>-{fmt(data.discount, data.currency)}</Text>
            </View>
          )}
          {data.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({data.taxRate}%):</Text>
              <Text style={styles.totalValue}>{fmt(data.taxAmount, data.currency)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>{fmt(data.grandTotal, data.currency)}</Text>
          </View>
        </View>
      </View>

      {/* Terms & Warranty */}
      {data.terms && (
        <View style={styles.section}>
          <Text style={styles.termsLabel}>Terms & Conditions</Text>
          <Text style={styles.termsText}>{data.terms}</Text>
        </View>
      )}
      {data.warranty && (
        <View style={styles.section}>
          <Text style={styles.termsLabel}>Warranty</Text>
          <Text style={styles.termsText}>{data.warranty}</Text>
        </View>
      )}
      {data.footer && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{data.footer}</Text>
        </View>
      )}

      {/* Signatures */}
      <View style={styles.signaturesContainer}>
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Authorized Signature</Text>
          <Text style={styles.signatureSubLabel}>{data.company.name}</Text>
        </View>
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Customer Acceptance</Text>
          <Text style={styles.signatureSubLabel}>{data.customer.name}</Text>
        </View>
      </View>

      <Text style={styles.generatedNote}>
        This is a computer-generated document. {copyLabel}.
      </Text>
    </Page>
  );
}

export function QuotationPDF({ data }: { data: QuotationPDFData }) {
  const fontFamily = data.fontFamily || "Helvetica";
  const styles = createStyles(fontFamily);

  return (
    <Document>
      <QuotationPage data={data} copyLabel="Company Copy" styles={styles} />
      <QuotationPage data={data} copyLabel="Customer Copy" styles={styles} />
    </Document>
  );
}
