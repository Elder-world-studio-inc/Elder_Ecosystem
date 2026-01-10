import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
};

export const adminApi = {
  getKpi: () => api.get('/admin/kpi'),
  getAssetsValue: () => api.get('/admin/assets-value'),
  getRoyaltyStreams: () => api.get('/admin/royalty-streams'),
  getReceipts: () => api.get('/admin/receipts'),
  createReceipt: (data: any) => api.post('/admin/receipts', data),
  getContracts: () => api.get('/admin/contracts'),
  createContract: (data: any) => api.post('/admin/contracts', data),
  getBudget: () => api.get('/admin/budget'),
  getCapTable: () => api.get('/admin/cap-table'),
  grantOptions: (userId: string, shares: number) => api.post('/admin/cap-table/grant', { userId, shares }),
};

export const shareholdersApi = {
  getAll: () => api.get('/admin/shareholders'),
  create: (data: any) => api.post('/admin/shareholders', data),
};

export const usersApi = {
  getAll: () => api.get('/admin/users'),
  create: (data: any) => api.post('/admin/users', data),
  update: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  delete: (id: string) => api.delete(`/admin/users/${id}`),
  resetPassword: (id: string, newPassword: string) => api.post(`/admin/users/${id}/reset-password`, { newPassword }),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

export const assetApi = {
  getAll: (params?: { divisionId?: string }) => api.get('/admin/assets', { params }),
  create: (data: any) => api.post('/admin/assets', data),
  update: (id: string, data: any) => api.put(`/admin/assets/${id}`, data),
  updateStatus: (id: string, status: string, userRole: string) => 
    api.put(`/admin/assets/${id}/status`, { status, userRole })
};

export const interactiveApi = {
  getAssets: () => api.get('/admin/interactive/assets'),
  getVault: () => api.get('/admin/interactive/vault'),
  getProjects: () => api.get('/admin/interactive/projects'),
  signAsset: (data: any) => api.post('/admin/interactive/assets/sign', data),
  requestAsset: (data: any) => api.post('/admin/interactive/projects/request', data),
  deploy: () => api.post('/admin/interactive/deploy', {}),
};

export const organizationApi = {
  getDivisions: () => api.get('/admin/organization/divisions'),
  getRoles: () => api.get('/admin/organization/roles'),
  getStructure: () => api.get('/admin/organization/structure'),
};

export default api;
