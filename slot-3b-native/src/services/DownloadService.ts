import * as FileSystem from 'expo-file-system';
import { EncryptionService } from './EncryptionService';

export interface OfflineChapter {
  id: string;
  title: string;
  pages: string[]; // List of local file URIs
  totalSize: number;
}

const BASE_DIR = FileSystem.documentDirectory + 'downloads/';
const METADATA_FILE = BASE_DIR + 'metadata.json';

export const downloadService = {
  
  async init() {
    const dirInfo = await FileSystem.getInfoAsync(BASE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(BASE_DIR);
    }
  },

  async downloadChapter(chapterId: string, title: string, pageUrls: string[]) {
    await this.init();
    
    const chapterDir = BASE_DIR + chapterId + '/';
    await FileSystem.makeDirectoryAsync(chapterDir, { intermediates: true });

    const localPages: string[] = [];
    let totalSize = 0;

    for (let i = 0; i < pageUrls.length; i++) {
      const url = pageUrls[i];
      const filename = `page_${i}.enc`; // Encrypted extension
      const fileUri = chapterDir + filename;

      // 1. Download to temporary file
      const tempDownload = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + 'temp_' + filename);
      
      // 2. Read file as Base64
      const fileData = await FileSystem.readAsStringAsync(tempDownload.uri, { encoding: FileSystem.EncodingType.Base64 });
      
      // 3. Encrypt Data
      const encryptedData = EncryptionService.encrypt(fileData);
      
      // 4. Write Encrypted Data to Storage
      await FileSystem.writeAsStringAsync(fileUri, encryptedData);
      
      // 5. Cleanup Temp
      await FileSystem.deleteAsync(tempDownload.uri);

      localPages.push(fileUri);
      
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        totalSize += fileInfo.size;
      }
    }

    // Save Metadata
    const newChapter: OfflineChapter = { id: chapterId, title, pages: localPages, totalSize };
    await this.saveMetadata(newChapter);
    
    return newChapter;
  },

  async getDownloads(): Promise<OfflineChapter[]> {
    await this.init();
    const info = await FileSystem.getInfoAsync(METADATA_FILE);
    if (!info.exists) return [];
    
    const content = await FileSystem.readAsStringAsync(METADATA_FILE);
    return JSON.parse(content);
  },

  async saveMetadata(chapter: OfflineChapter) {
    const current = await this.getDownloads();
    const updated = [...current.filter(c => c.id !== chapter.id), chapter];
    await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(updated));
  },

  async deleteChapter(chapterId: string) {
    const chapterDir = BASE_DIR + chapterId + '/';
    await FileSystem.deleteAsync(chapterDir, { idempotent: true });
    
    const current = await this.getDownloads();
    const updated = current.filter(c => c.id !== chapterId);
    await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(updated));
  },

  async loadPage(fileUri: string): Promise<string> {
    // Read encrypted file
    const encryptedData = await FileSystem.readAsStringAsync(fileUri);
    // Decrypt
    const decryptedData = EncryptionService.decrypt(encryptedData);
    // Return as Base64 image src
    return `data:image/jpeg;base64,${decryptedData}`;
  }
};
