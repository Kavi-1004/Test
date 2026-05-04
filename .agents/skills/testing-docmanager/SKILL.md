# Testing DocManager ERP-lite

## Prerequisites

### Dev Server
```bash
cd /home/ubuntu/repos/Test
npm run dev
# Runs on http://localhost:3000
```

### Database
- PostgreSQL must be running on localhost:5432
- Database: `docmanager`, User: `devuser`, Password: `devpass`
- Run `npx prisma db push` if schema changes, then `npx prisma db seed` for test data

### Login Credentials
- Admin: `admin@docmanager.com` / `admin123`
- Role-based access: admin has full access, user role has restricted access

## Devin Secrets Needed
- No secrets required for local testing — all credentials are dev-only defaults
- For email testing: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (optional — app gracefully handles missing SMTP config)

## Key Testing Workflows

### 1. Quotation PDF Export
- Navigate to `/quotations` and click the green download icon
- PDF opens in new tab via `/api/quotations/{id}/pdf`
- Verify: company header, customer details, items table, totals, footer
- Uses `@react-pdf/renderer` server-side — no browser PDF engine needed

### 2. PO File Upload
- Navigate to `/purchase-orders` → "Upload PO"
- **Important**: The quotation dropdown only shows quotations with `status=SENT`
- If dropdown is empty, change quotation status: either use "Save & Send" button in quotation editor, or run:
  ```sql
  UPDATE "Quotation" SET status = 'SENT' WHERE "quotationNumber" = 'ACME-Q-...';
  ```
- File picker accepts: PDF, PNG, JPG, DOC, DOCX (max 10MB)
- After selecting a file, filename should appear in green text
- Upload directory: `/home/ubuntu/repos/Test/uploads` (gitignored)

### 3. Email Dialog
- Open quotation editor (`/quotations/{id}/edit`) → click "Email" button in toolbar
- "Email" and "PDF" buttons only appear when editing an existing quotation (not on `/quotations/new`)
- Dialog pre-fills customer email from the database
- Without SMTP configured, sending will return an informative error (not a crash)

### 4. Invoice PDF Export
- Requires: Company → Customer → Quotation → Delivery Order → Invoice (full workflow)
- Navigate to `/invoices` and click download PDF icon
- Verify: INVOICE header, invoice number, items, totals, payment details section, DO reference

### 5. Full Document Workflow
1. Create Company (with short code like "ACME")
2. Create Customer
3. Create Quotation (split-screen editor with live preview)
4. Send Quotation (changes status to SENT)
5. Upload PO (linked to SENT quotation)
6. Create Delivery Order (linked to quotation)
7. Create Invoice (linked to DO)

## Document ID Format
- Quotation: `COMPANYSHORT-Q-YYYYMMDD-###` (e.g., ACME-Q-20260501-001)
- Delivery Order: `COMPANYSHORT-DO-YYYYMMDD-###`
- Invoice: `COMPANYSHORT-I-YYYYMMDD-###`
- Revisions append `-R1`, `-R2`, etc.

## Known Gotchas
- The base branch is `base`, not `main` or `master`
- Next.js 16 has breaking changes — read docs in `node_modules/next/dist/docs/` before modifying code
- "middleware" file convention is deprecated in favor of "proxy" (warning is pre-existing, not a bug)
- Quotation calculations: Subtotal - Discount + Tax = Grand Total
- File uploads use the Web API `FormData`, not multer middleware directly — the upload route handles `request.formData()`
- For Playwright-based file input testing, use CDP at `http://localhost:29229` and `setInputFiles()` on the hidden file input
- Playwright may need to be installed globally: `npm install -g playwright`, then use `NODE_PATH` to resolve it
