# Testing DocManager ERP-lite

## Environment Setup

1. Ensure PostgreSQL is running on `localhost:5432` with database `docmanager`
2. Run `npx prisma db push` and `npx prisma db seed` if DB is empty
3. Start dev server: `npm run dev` (port 3000)
4. Verify server is up: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/login` should return 200

## Devin Secrets Needed

No external secrets required. All credentials are local dev-only:
- DB: `postgresql://devuser:devpass@localhost:5432/docmanager`
- Admin login: `admin@docmanager.com` / `admin123`
- JWT secret is hardcoded for dev in `.env`

## Authentication

- Login at `/login` with `admin@docmanager.com` / `admin123`
- JWT token stored in `auth-token` cookie
- Session persists across page navigations within the same browser session

## Key Testing Flows

### Quotation Create → Edit Workflow (Critical Path)

This is the most important flow to test — it involves client-side navigation via `router.push()` which can cause React component reuse bugs.

1. Navigate to `/quotations/new`
2. Select company and customer from dropdowns
3. Enter title, add items with quantities and prices
4. Set discount and tax rate
5. Click "Save Draft"
6. **Verify**: Page redirects to `/quotations/{id}/edit` with ALL form fields populated
7. **Key assertion**: Company/customer dropdowns should NOT show "Select company"/"Select customer" — they should show the saved values

### What a broken edit page looks like:
- Company dropdown: "Select company" (instead of saved company)
- Customer dropdown: "Select customer" (instead of saved customer)
- Title: empty
- Items: single default empty row with qty=1, price=0
- Totals: all $0.00

## Common Pitfalls

### React Form Interactions via Computer Use
- Clicking near the "+ Add Item" button area might accidentally trigger multiple item additions
- When filling item rows, use the JavaScript console with `nativeInputValueSetter` pattern for reliable React state updates:
  ```js
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(element, 'value');
  element.dispatchEvent(new Event('input', { bubbles: true }));
  ```
- Select dropdowns work fine with native click interactions
- The totals section (discount, tax) might be offscreen — scroll down or use console to set values

### Document ID Format
- Quotations: `COMPANYSHORT-Q-YYYYMMDD-NNN` (e.g., `ACME-Q-20260502-001`)
- The date in the ID comes from the quotation date field, not the creation timestamp

### Expected Calculation Formula
- Subtotal = sum of (qty × price) for each item
- Discount is a flat dollar amount subtracted from subtotal
- Tax = (subtotal - discount) × (taxRate / 100)
- Grand Total = subtotal - discount + tax

## Modules Available for Testing

| Module | URL | Notes |
|--------|-----|-------|
| Dashboard | `/` | Shows metrics: total quotations, approved, etc. |
| Companies | `/companies` | CRUD with short codes |
| Customers | `/customers` | CRUD with contact info |
| Quotations | `/quotations` | Split-screen editor with live preview |
| Purchase Orders | `/purchase-orders` | URL-based PO attachment |
| Delivery Orders | `/delivery-orders` | Generate from approved quotations |
| Invoices | `/invoices` | Generate from delivery orders |
| Audit Logs | `/logs` | Shows CREATED/EDITED/DELETED entries |
| Settings | `/settings` | Feature toggles, saves with success message |

## Branch Info

- Main development branch: `base` (not `main` or `master`)
- PRs should target `base`
