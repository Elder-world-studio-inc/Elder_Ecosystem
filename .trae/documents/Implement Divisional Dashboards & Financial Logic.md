# Implement Dual-Pane Architecture with Global State & Legal Integration

## 1. Global State Management (`app/context/`)
- Create `app/context/AdminContext.tsx` (`AdminProvider`) to track:
  - `intangibleAssetsValue`: Total dollar value of IP (starts with mock base).
  - `royaltyCategories`: List of active royalty streams.
  - `generatedReceipts`: Log of Work-for-Hire receipts.
  - `signedContracts`: Registry of valid IP assignments.
- Create `app/providers.tsx` to wrap the application with `AdminProvider`.

## 2. Enhanced Legal Gate (`components/legal/`)
- Create `components/legal/ContractSigningModal.tsx`:
  - **UX**: High-security modal (not a checkbox).
  - **Inputs**: Full Name (Digital Signature), Date Stamp.
  - **Action**: "Execute Agreement" button.
  - **Logic**: On success, dispatches actions to `AdminContext` (Increase Asset Value, Add Royalty, Log Receipt).

## 3. Executive Suite (C-Suite Command Center)
- Create `app/command-center/page.tsx`:
  - **Valuation Ticker**: Consumes `intangibleAssetsValue` from Context.
  - **Legal Shield**: Lights up based on `signedContracts` in Context.
  - **Cap Table Ledger**: Displays Founder vs. Pool equity.
  - **Royalty Escrow**: Shows revenue split based on `royaltyCategories`.

## 4. Production Divisions (`app/divisions/`)
- **Omnivael (`app/divisions/omnivael/page.tsx`)**:
  - Manuscript Uploader: "Submit" button triggers `ContractSigningModal`.
- **Wayfarer (`app/divisions/wayfarer/page.tsx`)**:
  - 3D Asset Library: Uploading triggers `ContractSigningModal`.
- **Operations (`app/divisions/operations/page.tsx`)**:
  - Global Clock (JAX/Memphis/Multan).
  - Hiring Pipeline & Meeting Logs.

## 5. Navigation
- Update `components/Sidebar.tsx`:
  - Group 1: **Executive Suite** (Command Center).
  - Group 2: **Divisions** (Omnivael, Wayfarer, Ops).
  - Group 3: **Governance** (Equity, Settings).
