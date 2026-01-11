import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.0.2.2:5000/api/auth'; // Android Emulator loopback
// const API_URL = 'http://localhost:5000/api/auth'; // iOS Simulator
// const API_URL = 'https://your-vps-url.com/api/auth'; // Production

const TOKEN_KEY = 'auth_token';

export const AuthService = {
  async login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    
    await this.saveToken(data.token);
    return data.user;
  },

  async signup(userData) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Signup failed');

    await this.saveToken(data.token);
    return data.user;
  },

  async forgotPassword(email) {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    
    return data.message;
  },

  async saveToken(token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};
