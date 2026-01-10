# Hostinger Deployment Guide

This guide explains how to configure the environment variables for the Admin Engine Frontend on Hostinger.

## 1. Environment Variables

Since `.env` files are ignored by git (for security), they are not pushed to Hostinger. You must set these variables in your Hostinger Dashboard (under **Settings** > **Environment Variables** or similar).

### Frontend Variables (admin-engine-frontend)

You need to set **two** variables for the frontend to work correctly:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `/api` | Tells the frontend to send requests to its own `/api` path (which we proxy). **Do NOT** put the full backend URL here. |
| `BACKEND_URL` | `https://your-backend-url.com` | **Replace this** with the actual URL where your backend is running. Next.js will forward requests from `/api` to this URL. |

**Example:**
If your backend is hosted at `https://admin-backend-xyz.hostinger.app`, set `BACKEND_URL` to `https://admin-backend-xyz.hostinger.app`.

---

## 2. Why this setup?

We are using a **Rewrite Proxy** in `next.config.ts`.
1. The user's browser sends a request to `https://your-frontend.com/api/login`.
2. Next.js receives it and checks `next.config.ts`.
3. It sees the rewrite rule and forwards the request to `BACKEND_URL` (e.g., `https://your-backend.com/api/login`).
4. The backend responds, and Next.js passes the response back to the browser.

**Benefits:**
- **No CORS Issues:** The browser thinks it's talking to the frontend, so Cross-Origin Resource Sharing (CORS) errors are avoided.
- **Secure Cookies:** Cookies set by the backend will be accepted by the browser more easily.
