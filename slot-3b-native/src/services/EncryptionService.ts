import CryptoJS from 'crypto-es';

const SECRET_KEY = 'omnivael-secret-key-v1'; // Ideally fetched from secure storage or env

export const EncryptionService = {
  encrypt: (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  },

  decrypt: (cipherText: string): string => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
};
