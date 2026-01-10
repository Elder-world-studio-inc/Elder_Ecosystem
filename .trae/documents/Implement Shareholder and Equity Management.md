I will implement the Shareholder and Equity Management features as requested.

### 1. Backend Implementation
*   **Data Structure (`admin-engine-backend/src/data.js`)**:
    *   Initialize a `SHAREHOLDERS` array with mock data (Founders, Investors).
    *   Update `CAP_TABLE` to be dynamically calculated or just keep it as the "ledger" source of truth that gets updated.
*   **API Endpoints (`admin-engine-backend/src/routes/admin.js`)**:
    *   `GET /admin/shareholders`: Retrieve the list of shareholders.
    *   `POST /admin/shareholders`: Add a new shareholder (e.g., a new investor).
    *   `PUT /admin/shareholders/:id`: Update shareholder details (e.g., share count).
    *   `POST /admin/cap-table/grant`: A specialized endpoint to "grant options" to an employee. This will:
        1.  Find the user in `USERS`.
        2.  Add an `equityGrants` record to the user (or a separate table).
        3.  Increase `CAP_TABLE.poolUtilized`.

### 2. Frontend API Integration
*   **API Client (`admin-engine-frontend/lib/api.ts`)**:
    *   Add `shareholdersApi` object with methods: `getAll`, `create`, `update`.
    *   Add `adminApi.grantOptions(userId, amount)` method.
*   **Context (`admin-engine-frontend/app/context/AdminContext.tsx`)**:
    *   Add `shareholders` to the context state.
    *   Add `fetchShareholders` function.
    *   Expose these via the `useAdmin` hook.

### 3. Frontend UI Implementation
*   **New Component (`components/executive/EquityManagement.tsx`)**:
    *   **Shareholder Directory**: A table listing Name, Type (Founder/Investor/Employee), Shares, and Ownership %.
    *   **Grant Options Form**: A modal or section to select an Employee and input a number of shares to grant.
*   **Update Command Center (`app/command-center/page.tsx`)**:
    *   Add a new tab: **"Equity"**.
    *   Render the `EquityManagement` component when this tab is active.
*   **Update Cap Table Ledger (`components/executive/CapTableLedger.tsx`)**:
    *   Ensure it reflects the live `capTable` data from the context (it likely already does, but we'll verify it updates when grants happen).
