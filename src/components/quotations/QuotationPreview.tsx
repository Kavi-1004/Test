interface QuotationItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface Company {
  name: string;
  shortCode: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logoUrl?: string | null;
  registrationNo?: string | null;
}

interface Customer {
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface Props {
  company: Company | null;
  customer: Customer | null;
  quotationNumber: string;
  title: string;
  date: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  terms: string;
  warranty: string;
  footer: string;
  validity?: number;
  salesPerson?: string;
  salesPhone?: string;
  salesEmail?: string;
  fontFamily?: string;
  currency?: string;
}

function currencySymbol(c?: string) {
  if (c === "USD") return "$";
  if (c === "EUR") return "\u20AC";
  if (c === "GBP") return "\u00A3";
  return "Rs.";
}

export default function QuotationPreview({
  company,
  customer,
  quotationNumber,
  title,
  date,
  items,
  subtotal,
  discount,
  taxRate,
  taxAmount,
  grandTotal,
  terms,
  warranty,
  footer,
  validity = 30,
  salesPerson,
  salesPhone,
  salesEmail,
  fontFamily = "Helvetica",
  currency = "LKR",
}: Props) {
  const sym = currencySymbol(currency);
  const fontClass = fontFamily === "Times-Roman" ? "font-serif" : fontFamily === "Courier" ? "font-mono" : "font-sans";

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-sm print:shadow-none print:border-none print:p-0 ${fontClass}`}>
      {/* Company Header */}
      <div className="text-center mb-6 border-b pb-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          {company?.logoUrl && (
            <img src={company.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
          )}
          <h2 className="text-2xl font-bold text-gray-900 uppercase">
            {company?.name || "Company Name"}
          </h2>
        </div>
        {company?.address && <p className="text-gray-600 whitespace-pre-line">{company.address}</p>}
        <div className="flex justify-center gap-4 mt-1 text-gray-600">
          {company?.phone && <span>Tel: {company.phone}</span>}
          {company?.email && <span>Email: {company.email}</span>}
        </div>
        {company?.registrationNo && (
          <p className="text-gray-600 mt-1">REG NO: {company.registrationNo}</p>
        )}
      </div>

      {/* Customer & Quotation Details */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">TO:</p>
          <h4 className="font-semibold text-gray-900">{customer?.name || "Customer Name"}</h4>
          {customer?.address && <p className="text-gray-600 whitespace-pre-line">{customer.address}</p>}
          {customer?.phone && <p className="text-gray-600">Tel: {customer.phone}</p>}
          {customer?.email && <p className="text-gray-600">Email: {customer.email}</p>}
          {customer?.contactPerson && (
            <p className="text-gray-600 mt-2"><span className="font-medium">ATTN:</span> {customer.contactPerson}</p>
          )}
        </div>
        <div>
          <div className="border border-gray-300 rounded p-3">
            <h3 className="text-lg font-bold text-blue-700 text-center uppercase mb-2">Quotation</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">NO:</span>
                <span className="font-mono">{quotationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">DATE:</span>
                <span>{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">VALIDITY:</span>
                <span>{validity} DAYS</span>
              </div>
              {salesPerson && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">SALES:</span>
                  <span>{salesPerson}</span>
                </div>
              )}
              {salesPhone && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">TEL:</span>
                  <span>{salesPhone}</span>
                </div>
              )}
              {salesEmail && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">EMAIL:</span>
                  <span>{salesEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      {title && (
        <div className="mb-4 bg-gray-100 px-3 py-2 rounded">
          <h3 className="text-base font-bold text-gray-900 uppercase">QUOTATION FOR {title}</h3>
        </div>
      )}

      {/* Items Table */}
      <table className="w-full mb-6 border border-gray-300">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="text-center px-3 py-2 text-xs font-medium uppercase border-r border-gray-600 w-10">No</th>
            <th className="text-left px-3 py-2 text-xs font-medium uppercase border-r border-gray-600">Item / Components</th>
            <th className="text-right px-3 py-2 text-xs font-medium uppercase border-r border-gray-600 w-24">Unit Price</th>
            <th className="text-center px-3 py-2 text-xs font-medium uppercase border-r border-gray-600 w-16">Qty</th>
            <th className="text-right px-3 py-2 text-xs font-medium uppercase w-28">Sub Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="px-3 py-2 text-center text-gray-600 border-r border-gray-200">{i + 1}</td>
              <td className="px-3 py-2 text-gray-900 border-r border-gray-200">{item.description || "-"}</td>
              <td className="px-3 py-2 text-right text-gray-900 border-r border-gray-200">{sym}{item.unitPrice.toFixed(2)}</td>
              <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">{item.quantity}</td>
              <td className="px-3 py-2 text-right text-gray-900 font-medium">{sym}{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64">
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Subtotal:</span>
            <span className="font-medium">{sym}{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-red-600">-{sym}{discount.toFixed(2)}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600">Tax ({taxRate}%):</span>
              <span className="font-medium">{sym}{taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t-2 border-gray-900 text-lg font-bold">
            <span>Grand Total:</span>
            <span>{sym}{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      {terms && (
        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-1">Terms & Conditions</h4>
          <p className="text-gray-700 whitespace-pre-line">{terms}</p>
        </div>
      )}

      {/* Warranty */}
      {warranty && (
        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-1">Warranty</h4>
          <p className="text-gray-700 whitespace-pre-line">{warranty}</p>
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="border-t pt-4 mt-4">
          <p className="text-gray-600 whitespace-pre-line">{footer}</p>
        </div>
      )}

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-10 pt-4">
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 h-12"></div>
          <p className="text-xs text-gray-600 font-medium uppercase">Authorized Signature</p>
          <p className="text-xs text-gray-500">{company?.name || "Company"}</p>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 h-12"></div>
          <p className="text-xs text-gray-600 font-medium uppercase">Customer Acceptance</p>
          <p className="text-xs text-gray-500">{customer?.name || "Customer"}</p>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400 border-t pt-3">
        This is a computer-generated document. Company Copy.
      </div>
    </div>
  );
}
