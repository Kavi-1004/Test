# Testing DocManager ERP-lite MVP

## Environment Setup

1. Ensure PostgreSQL is running: `pg_isready -h localhost -p 5432`
2. Set up environment variables in `.env` (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
3. Run Prisma migrations: `npx prisma migrate deploy`
4. Seed the database: `npx prisma db seed`
5. Start dev server: `npm run dev` (runs on port 3000)

## Devin Secrets Needed

No external secrets required — the app uses local PostgreSQL with dev credentials:
- Database: `postgresql://devuser:devpass@localhost:5432/docmanager`
- Admin login: `admin@docmanager.com` / `admin123`

## Test Credentials

- **Admin user**: `admin@docmanager.com` / `admin123` (seeded by `prisma/seed.ts`)
- Login page shows default credentials at the bottom as a hint

## Key Testing Workflows

### Core Document Flow
1. **Login** → Dashboard (verify 9 sidebar nav items)
2. **Companies** → Add Company with short code (e.g., ACME) — this sets up the document ID prefix
3. **Customers** → Add Customer with contact details
4. **Quotations** → New Quotation (split-screen editor)
   - Select Company and Customer from dropdowns
   - Company selection auto-fills Tax Rate from company settings
   - Add items with Description, Qty, Unit, Unit Price
   - Set Discount and Tax Rate in Totals section
   - Live preview updates in real-time on the right panel
5. **Save Draft** → Generates document ID in format `SHORTCODE-Q-YYYYMMDD-###`
6. **Dashboard** → Verify metrics increment
7. **Audit Logs** → Verify CREATED entries for each entity
8. **Settings** → Toggle feature modules on/off, save, verify success message

### Calculation Verification
For quotation calculations, use specific values that produce verifiable results:
- Example: Steel Beams (10 × $250 = $2,500) + Bolts (100 × $5 = $500) = Subtotal $3,000
- Discount $50, Tax 10%: Tax = ($3,000 - $50) × 0.10 = $295
- Grand Total = $3,000 - $50 + $295 = $3,245

## Navigation Tips

- Sidebar has 9 items: Dashboard, Companies, Customers, Quotations, Purchase Orders, Delivery Orders, Invoices, Audit Logs, Settings
- Company/Customer forms appear inline (not modals) when clicking "Add" buttons
- Quotation editor is at `/quotations/new` — uses split-screen layout
- Settings page has toggle switches for each module + Save Settings button

## Known Issues

- **Edit page data loading**: The quotation edit page (`/quotations/{id}/edit`) might not populate form fields with saved data after redirect from creation. The quotation is saved correctly (verifiable in the list view), but the edit form may show empty/default values. This may be a race condition or missing data fetch in the edit page component.
- **Dropdown selection**: When selecting from Company/Customer dropdowns, click the dropdown first to open it, then click the option. The DOM uses native `<select>` elements.
- **Number inputs**: When changing number fields (Qty, Unit Price), use triple-click to select all existing text before typing the new value to avoid appending.

## Testing Approach

- Use browser GUI interactions (not curl/API calls) for the most realistic end-to-end testing
- Record the browser session for visual proof
- Annotate key moments: test_start when beginning each test, assertion when verifying results
- Take screenshots at critical verification points (calculations, list views, dashboard metrics)
- Always verify both the editor values AND the live preview values match for quotation tests
