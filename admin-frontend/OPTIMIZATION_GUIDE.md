# Resource Optimization Guide

We noticed high resource usage (CPU/RAM). Here are the steps to fix it.

## 1. STOP Running in Dev Mode
**Never** run `npm run dev` or `next dev` in production. It consumes 5-10x more RAM and CPU than production mode.

**Correct Way:**
```bash
# Frontend
cd admin-engine-frontend
npm run build
npm start

# Backend
cd admin-engine-backend
npm start
```

## 2. Use PM2 (Recommended)
We have added an `ecosystem.config.js` file to the root. If you have PM2 installed on your Hostinger VPS, you can run:

```bash
pm2 start ecosystem.config.js
```

This limits memory usage and ensures the apps restart if they crash.

## 3. Optimizations Applied
We have applied the following fixes to the codebase:
1.  **Enabled Standalone Output**: `next.config.ts` now uses `output: 'standalone'`. This drastically reduces the size of the deployment and memory footprint.
2.  **Removed Unused Heavy Libraries**: Removed `puppeteer` from frontend dependencies (saves space and potential background processes).
3.  **Disabled React Compiler**: Temporarily disabled experimental compiler to ensure build stability and reduce overhead.

## 4. Hostinger Specifics
If you are using Hostinger's "Node.js App" feature (cPanel/hPanel):
1.  Set **Application Mode** to `Production`.
2.  Set **Startup File** to `npm run start` (or path to `server.js` if using standalone).
3.  Ensure **Build Command** is run (`npm run build`).

## 5. Verify Database
Ensure your PostgreSQL database is not running on the same droplet if it's a small VPS (1-2GB RAM). If it is, consider moving it to a managed database service or upgrading RAM.
