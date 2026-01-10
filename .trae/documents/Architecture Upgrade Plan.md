I understand. You want to ensure the backend is pure **JavaScript** (not TypeScript) while upgrading the architecture.

Here is the revised plan to transform "what we built here" into your 5-Slot Ecosystem, starting with a migration to JavaScript.

# Admin Engine Architecture Upgrade (JS Edition)

## Phase 1: Convert Backend to JavaScript
The current backend is written in TypeScript. I will convert it to standard JavaScript to meet your requirement.
1.  **Migration**: Rename `src/index.ts` and `src/data.ts` to `.js` files and remove all TypeScript type annotations.
2.  **Cleanup**: Uninstall `typescript`, `ts-node`, and `@types` dependencies. Update `package.json` to run `node src/index.js` directly.

## Phase 2: Establish Slot 4 (Shared API Hub)
Once in JavaScript, I will restructure the server to act as the centralized hub.
1.  **Security Middleware**: Create a `middleware/auth.js` file with a robust JWT verification function to protect your routes.
2.  **Route Separation**: Refactor `index.js` to use Express Routers for better organization:
    *   `/api/auth`: Shared login/registration logic.
    *   `/api/admin`: Internal Admin Tools (Slot 5).
    *   `/api/nexus` & `/api/omnivael`: Public/Staging app endpoints.
3.  **CORS Setup**: Configure Cross-Origin Resource Sharing to allow your future Nexus and Omnivael frontends to connect.

## Phase 3: Connect Slot 5 (Admin Frontend)
1.  **Frontend Update**: Update the Next.js frontend's API client (`lib/api.ts`) to work with the new backend structure.
2.  **Verification**: Ensure the Admin Dashboard still displays all KPIs and Asset data correctly after the migration.

**Shall I proceed with converting the backend to JavaScript and implementing the Shared API architecture?**
