import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { GlassView } from '../components/ui/GlassView';
import { useNavigation } from '@react-navigation/native';

// Mock Data mirroring Backend
const CHAPTERS = [
  {
    id: 'bk-001',
    title: 'The Chronicles of Omnivael',
    cover: 'https://via.placeholder.com/200x300/1a1a1a/gold?text=Chronicles',
    price: 300,
    isPremium: true
  },
  {
    id: 'cm-001',
    title: 'Wayfarer: Origins',
    cover: 'https://via.placeholder.com/200x300/1a1a1a/cyan?text=Origins',
    price: 200,
    isPremium: false
  },
  {
    id: 'st-001',
    title: 'The Merchant of Svit',
    cover: 'https://via.placeholder.com/200x300/1a1a1a/orange?text=Merchant',
    price: 200,
    isPremium: false
  },
  {
    id: 'bk-002',
    title: 'Codex of Laws',
    cover: 'https://via.placeholder.com/200x300/2a1a1a/red?text=Laws',
    price: 300,
    isPremium: true
  },
  {
    id: 'cm-002',
    title: 'Shadows of the Void',
    cover: 'https://via.placeholder.com/200x300/000000/purple?text=Void',
    price: 300,
    isPremium: true
  }
];

export const LibraryScreen = () => {
  const { gradients, colors, typography, spacing } = useTheme();
  const navigation = useNavigation();
  
  const [balance, setBalance] = useState(2450);
  const [ownedChapters, setOwnedChapters] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBuyPress = (chapter: any) => {
    setSelectedChapter(chapter);
    setModalVisible(true);
  };

  const confirmPurchase = () => {
    if (!selectedChapter) return;

    if (balance >= selectedChapter.price) {
      setBalance(prev => prev - selectedChapter.price);
      setOwnedChapters(prev => [...prev, selectedChapter.id]);
      setModalVisible(false);
      // Generate Receipt / Transaction ID (Mock)
      const txnId = `txn-${Date.now()}`;
      console.log(`Transaction Generated: ${txnId} for ${selectedChapter.title}`);
      
      // In a real app, we would call the backend API here:
      // await api.post('/purchase', { userId: 'me', chapterId: selectedChapter.id });
    } else {
      Alert.alert("Insufficient Shards", "You do not have enough shards to purchase this chapter.");
      setModalVisible(false);
    }
  };

  return (
    <LinearGradient colors={gradients.dashboard} style={styles.container}>
      <View style={[styles.header, { paddingTop: spacing.xl * 2, paddingHorizontal: spacing.l, paddingBottom: spacing.l }]}>
        <Text style={{ color: colors.text, fontSize: typography.sizes.xl, fontWeight: 'bold' }}>Library</Text>
        <View style={[styles.balanceBadge, { backgroundColor: colors.glassDark, borderColor: colors.primary }]}>
            <Text style={{ color: colors.secondary, fontSize: 10 }}>BALANCE</Text>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{balance} ⬡</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.l, gap: spacing.l }}>
        {CHAPTERS.map((chapter) => {
          const isOwned = ownedChapters.includes(chapter.id);
          const isPremium = chapter.isPremium;
          
          return (
            <GlassView key={chapter.id} style={styles.chapterCard} borderOpacity={isPremium ? 0.8 : 0.45}>
              <View style={{ flexDirection: 'row', gap: spacing.m }}>
                {/* Cover Image */}
                <View style={styles.coverContainer}>
                   <Image 
                     source={{ uri: chapter.cover }} 
                     style={styles.cover} 
                     resizeMode="cover"
                   />
                   {isPremium && (
                     <View style={[styles.premiumBadge, { backgroundColor: '#FFD700' }]}>
                       <Text style={{ color: '#000', fontSize: 8, fontWeight: 'bold' }}>PREMIUM</Text>
                     </View>
                   )}
                </View>

                {/* Info */}
                <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: spacing.s }}>
                  <View>
                    <Text style={{ color: colors.text, fontSize: typography.sizes.m, fontWeight: 'bold', marginBottom: 4 }}>{chapter.title}</Text>
                    <Text style={{ color: colors.secondary, fontSize: typography.sizes.s }}>{isPremium ? 'Exclusive Content' : 'Standard Edition'}</Text>
                  </View>

                  {/* Action Button */}
                  {isOwned ? (
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('Reader')}
                      style={[styles.actionButton, { backgroundColor: colors.success, borderColor: colors.success }]}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: typography.sizes.s }}>READ NOW</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      onPress={() => handleBuyPress(chapter)}
                      style={[styles.actionButton, { 
                        backgroundColor: isPremium ? 'rgba(255, 215, 0, 0.2)' : 'rgba(84, 137, 255, 0.2)', 
                        borderColor: isPremium ? '#FFD700' : colors.primary 
                      }]}
                    >
                      <Text style={{ color: isPremium ? '#FFD700' : colors.primary, fontWeight: 'bold', fontSize: typography.sizes.s }}>
                        BUY {chapter.price} ⬡
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </GlassView>
          );
        })}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassView style={[styles.modalContent, { borderColor: selectedChapter?.isPremium ? '#FFD700' : colors.primary }]} intensity={40}>
            {selectedChapter && (
              <View style={{ alignItems: 'center', gap: spacing.l }}>
                <Text style={{ color: colors.text, fontSize: typography.sizes.l, fontWeight: 'bold' }}>Confirm Purchase</Text>
                
                <Image 
                  source={{ uri: selectedChapter.cover }} 
                  style={{ width: 120, height: 180, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight }} 
                />
                
                <View>
                  <Text style={{ color: colors.text, textAlign: 'center', fontSize: typography.sizes.m, fontWeight: '600' }}>{selectedChapter.title}</Text>
                  <Text style={{ color: colors.secondary, textAlign: 'center', marginTop: 4 }}>
                    Price: <Text style={{ color: selectedChapter.isPremium ? '#FFD700' : colors.primary, fontWeight: 'bold' }}>{selectedChapter.price} Shards</Text>
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: spacing.m, width: '100%' }}>
                  <TouchableOpacity 
                    style={[styles.modalButton, { borderColor: colors.secondary, backgroundColor: 'rgba(255,255,255,0.1)' }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={{ color: colors.text }}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                    onPress={confirmPurchase}
                  >
                    <Text style={{ color: '#000', fontWeight: 'bold' }}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </GlassView>
        </View>
      </Modal>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'flex-end'
  },
  chapterCard: {
    padding: 12,
  },
  coverContainer: {
    position: 'relative',
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  premiumBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});
