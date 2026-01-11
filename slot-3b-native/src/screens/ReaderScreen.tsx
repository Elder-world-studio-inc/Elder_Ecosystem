import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { downloadService } from '../services/DownloadService';
import { useNavigation, useRoute } from '@react-navigation/native';

// Mock data for online reading
const MOCK_PAGES = [
  'https://via.placeholder.com/400x600/0a1429/ffffff?text=Page+1',
  'https://via.placeholder.com/400x600/0f1e3d/ffffff?text=Page+2',
  'https://via.placeholder.com/400x600/142852/ffffff?text=Page+3',
];

export const ReaderScreen = () => {
  const { gradients, colors, spacing } = useTheme();
  const navigation = useNavigation();
  const [pages, setPages] = useState<string[]>(MOCK_PAGES);
  const [downloading, setDownloading] = useState(false);
  const width = Dimensions.get('window').width;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadService.downloadChapter(
        'chap-1', 
        'The Crystal Vanguard - Ep. 1', 
        MOCK_PAGES
      );
      alert('Chapter Downloaded & Encrypted!');
    } catch (e) {
      alert('Download Failed');
      console.error(e);
    }
    setDownloading(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.dashboard} style={StyleSheet.absoluteFill} />
      
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: spacing.xl, backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.text }}>CLOSE</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontWeight: 'bold' }}>EPISODE 1</Text>
        <TouchableOpacity onPress={handleDownload} disabled={downloading}>
          <Text style={{ color: downloading ? colors.secondary : colors.primary }}>
            {downloading ? 'SAVING...' : 'DOWNLOAD'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {pages.map((uri, index) => (
          <Image 
            key={index} 
            source={{ uri }} 
            style={{ width: width, height: width * 1.5 }} 
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10,
  },
});
