import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  companyName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#111827" },
  companyDetail: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  docTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#2563eb", textAlign: "right", textTransform: "uppercase" },
  docNumber: { fontSize: 8, color: "#6b7280", fontFamily: "Courier", marginTop: 4, textAlign: "right" },
  docDate: { fontSize: 9, color: "#6b7280", marginTop: 4, textAlign: "right" },
  section: { marginBottom: 15 },
  sectionLabel: { fontSize: 8, color: "#9ca3af", textTransform: "uppercase", fontFamily: "Helvetica-Bold", marginBottom: 3 },
  customerName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#111827" },
  customerDetail: { fontSize: 9, color: "#6b7280", marginTop: 1 },
  title: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 10 },
  table: { marginBottom: 15 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f9fafb", paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  tableHeaderCell: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6b7280", textTransform: "uppercase" },
  tableRow: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: "#f3f4f6" },
  tableCell: { fontSize: 9, color: "#111827" },
  colNum: { width: "5%" },
  colDesc: { width: "40%" },
  colQty: { width: "10%", textAlign: "right" },
  colUnit: { width: "10%", textAlign: "center" },
  colPrice: { width: "17%", textAlign: "right" },
  colTotal: { width: "18%", textAlign: "right" },
  totalsContainer: { alignItems: "flex-end", marginBottom: 15 },
  totalsBox: { width: 200 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalLabel: { fontSize: 9, color: "#6b7280" },
  totalValue: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 2, borderTopColor: "#111827", marginTop: 3 },
  grandTotalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  grandTotalValue: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  discountValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#dc2626" },
  termsLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9ca3af", textTransform: "uppercase", marginBottom: 3 },
  termsText: { fontSize: 9, color: "#374151" },
  footer: { borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 10, marginTop: 15 },
  footerText: { fontSize: 9, color: "#6b7280" },
  generatedNote: { textAlign: "center", fontSize: 7, color: "#d1d5db", marginTop: 20 },
});

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
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function QuotationPDF({ data }: { data: QuotationPDFData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{data.company.name}</Text>
            {data.company.address && <Text style={styles.companyDetail}>{data.company.address}</Text>}
            {data.company.phone && <Text style={styles.companyDetail}>Tel: {data.company.phone}</Text>}
            {data.company.email && <Text style={styles.companyDetail}>Email: {data.company.email}</Text>}
          </View>
          <View>
            <Text style={styles.docTitle}>Quotation</Text>
            <Text style={styles.docNumber}>{data.quotationNumber}</Text>
            <Text style={styles.docDate}>Date: {data.date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bill To</Text>
          <Text style={styles.customerName}>{data.customer.name}</Text>
          {data.customer.contactPerson && <Text style={styles.customerDetail}>Attn: {data.customer.contactPerson}</Text>}
          {data.customer.address && <Text style={styles.customerDetail}>{data.customer.address}</Text>}
          {data.customer.phone && <Text style={styles.customerDetail}>Tel: {data.customer.phone}</Text>}
          {data.customer.email && <Text style={styles.customerDetail}>Email: {data.customer.email}</Text>}
        </View>

        {data.title && <Text style={styles.title}>{data.title}</Text>}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNum]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colUnit]}>Unit</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Price</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colNum]}>{i + 1}</Text>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.description || "-"}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colUnit]}>{item.unit}</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>${fmt(item.unitPrice)}</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>${fmt(item.total)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>${fmt(data.subtotal)}</Text>
            </View>
            {data.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount:</Text>
                <Text style={styles.discountValue}>-${fmt(data.discount)}</Text>
              </View>
            )}
            {data.taxRate > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax ({data.taxRate}%):</Text>
                <Text style={styles.totalValue}>${fmt(data.taxAmount)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotalValue}>${fmt(data.grandTotal)}</Text>
            </View>
          </View>
        </View>

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

        <Text style={styles.generatedNote}>This is a computer-generated document. No signature is required.</Text>
      </Page>
    </Document>
  );
}
