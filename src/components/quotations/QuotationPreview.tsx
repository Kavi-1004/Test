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
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-sm print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {company?.name || "Company Name"}
          </h2>
          {company?.address && <p className="text-gray-600 mt-1 whitespace-pre-line">{company.address}</p>}
          {company?.phone && <p className="text-gray-600">Tel: {company.phone}</p>}
          {company?.email && <p className="text-gray-600">Email: {company.email}</p>}
        </div>
        <div className="text-right">
          <h3 className="text-xl font-bold text-blue-600 uppercase">Quotation</h3>
          <p className="text-gray-600 mt-1 font-mono text-xs">{quotationNumber}</p>
          <p className="text-gray-600 mt-1">Date: {date}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Bill To</p>
        <h4 className="font-semibold text-gray-900">{customer?.name || "Customer Name"}</h4>
        {customer?.contactPerson && <p className="text-gray-600">Attn: {customer.contactPerson}</p>}
        {customer?.address && <p className="text-gray-600 whitespace-pre-line">{customer.address}</p>}
        {customer?.phone && <p className="text-gray-600">Tel: {customer.phone}</p>}
        {customer?.email && <p className="text-gray-600">Email: {customer.email}</p>}
      </div>

      {/* Title */}
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      {/* Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-3 py-2 text-xs font-medium text-gray-600 uppercase">#</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-gray-600 uppercase">Description</th>
            <th className="text-right px-3 py-2 text-xs font-medium text-gray-600 uppercase">Qty</th>
            <th className="text-center px-3 py-2 text-xs font-medium text-gray-600 uppercase">Unit</th>
            <th className="text-right px-3 py-2 text-xs font-medium text-gray-600 uppercase">Price</th>
            <th className="text-right px-3 py-2 text-xs font-medium text-gray-600 uppercase">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <tr key={i}>
              <td className="px-3 py-2 text-gray-500">{i + 1}</td>
              <td className="px-3 py-2 text-gray-900">{item.description || "-"}</td>
              <td className="px-3 py-2 text-right text-gray-900">{item.quantity}</td>
              <td className="px-3 py-2 text-center text-gray-600">{item.unit}</td>
              <td className="px-3 py-2 text-right text-gray-900">${item.unitPrice.toFixed(2)}</td>
              <td className="px-3 py-2 text-right text-gray-900 font-medium">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-1">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-red-600">-${discount.toFixed(2)}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Tax ({taxRate}%):</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t-2 border-gray-900 text-lg font-bold">
            <span>Grand Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      {terms && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Terms & Conditions</h4>
          <p className="text-gray-700 whitespace-pre-line">{terms}</p>
        </div>
      )}

      {/* Warranty */}
      {warranty && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Warranty</h4>
          <p className="text-gray-700 whitespace-pre-line">{warranty}</p>
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="border-t pt-4 mt-6">
          <p className="text-gray-600 whitespace-pre-line">{footer}</p>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-gray-400">
        This is a computer-generated document. No signature is required.
      </div>
    </div>
  );
}
