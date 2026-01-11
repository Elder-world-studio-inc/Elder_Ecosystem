import { AuthService } from './AuthService';

// const API_URL = 'http://localhost:5000/api/nexus';
const API_URL = 'http://10.0.2.2:5000/api/nexus'; // Android Emulator

export const NexusService = {
  async getProfile() {
    const token = await AuthService.getToken();
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  },

  async getTransactions() {
    const token = await AuthService.getToken();
    const response = await fetch(`${API_URL}/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return await response.json();
  },

  async createPaymentIntent(amountInCents: number) {
    const token = await AuthService.getToken();
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount: amountInCents })
    });
    if (!response.ok) throw new Error('Failed to create payment intent');
    return await response.json();
  },

  async confirmPurchase(shards: number, itemDescription: string) {
    const token = await AuthService.getToken();
    const response = await fetch(`${API_URL}/confirm-purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount: shards, item: itemDescription })
    });
    if (!response.ok) throw new Error('Failed to confirm purchase');
    return await response.json();
  }
};
