import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { GlassView } from '../components/ui/GlassView';
import { downloadService, OfflineChapter } from '../services/DownloadService';

export const DownloadsScreen = () => {
  const { gradients, colors, spacing, typography } = useTheme();
  const [downloads, setDownloads] = useState<OfflineChapter[]>([]);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    const list = await downloadService.getDownloads();
    setDownloads(list);
  };

  const handleDelete = async (chapterId: string) => {
    await downloadService.deleteChapter(chapterId);
    loadDownloads();
  };

  return (
    <LinearGradient colors={gradients.dashboard} style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingTop: 60 }}>
        <Text style={{ color: colors.text, fontSize: typography.sizes.xl, marginBottom: spacing.l }}>OFFLINE CONTENT</Text>
        
        {downloads.length === 0 ? (
          <Text style={{ color: colors.secondary, textAlign: 'center' }}>No downloaded chapters.</Text>
        ) : (
          downloads.map((chapter) => (
            <GlassView key={chapter.id} style={{ marginBottom: spacing.m, padding: spacing.m }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: colors.text, fontWeight: 'bold' }}>{chapter.title}</Text>
                  <Text style={{ color: colors.secondary, fontSize: 10 }}>{chapter.pages.length} Pages • {(chapter.totalSize / 1024 / 1024).toFixed(1)} MB</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(chapter.id)}>
                   <Text style={{ color: colors.error, fontSize: 10 }}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </GlassView>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
