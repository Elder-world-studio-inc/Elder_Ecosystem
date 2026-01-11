import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassView } from '../components/ui/GlassView';
import { GlassButton } from '../components/ui/GlassButton';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { NexusService } from '../services/NexusService';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { colors, gradients, spacing } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [profileData, transactionsData] = await Promise.all([
        NexusService.getProfile(),
        NexusService.getTransactions()
      ]);
      setProfile(profileData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to fetch vault data', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTransaction = ({ item }: { item: any }) => (
    <GlassView style={styles.transactionCard} intensity={20}>
      <View style={styles.transactionRow}>
        <View style={styles.transactionInfo}>
          <Text style={[styles.transactionItem, { color: colors.text }]}>{item.item}</Text>
          <Text style={[styles.transactionDate, { color: colors.secondaryText }]}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[
          styles.transactionAmount, 
          { color: item.amount > 0 ? colors.success : colors.primary }
        ]}>
          {item.amount > 0 ? '+' : ''}{item.amount}
        </Text>
      </View>
    </GlassView>
  );

  return (
    <LinearGradient colors={gradients.dashboard} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={gradients.buttonPrimary}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {profile?.username?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </View>
            <Text style={[styles.username, { color: colors.text }]}>
              {profile?.username || user?.username}
            </Text>
            <Text style={[styles.userLevel, { color: colors.primary }]}>
              Level {profile?.level || 1} • {profile?.isElite ? 'Elite Member' : 'Initiate'}
            </Text>
          </View>

          {/* Shard Balance Card */}
          <GlassView style={styles.balanceCard} intensity={40} gradient={gradients.card}>
            <Text style={[styles.balanceLabel, { color: colors.secondaryText }]}>Shard Balance</Text>
            <Text style={[styles.balanceAmount, { color: colors.primary, textShadowColor: colors.primary, textShadowRadius: 10 }]}>
              {profile?.shards || 0}
            </Text>
            <View style={styles.xpBarContainer}>
               <View style={[styles.xpBar, { width: `${(profile?.xp % 1000) / 10}%`, backgroundColor: colors.success }]} />
            </View>
            <Text style={[styles.xpText, { color: colors.secondaryText }]}>
              {profile?.xp || 0} XP / 1000 to next level
            </Text>
            
            <View style={styles.buyButtonContainer}>
              <GlassButton 
                title="Get More Shards" 
                onPress={() => (navigation as any).navigate('ShardStore')}
                variant="primary"
              />
            </View>
          </GlassView>

          {/* Transaction History */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction History</Text>
          {transactions.map((item) => (
             <View key={item.id} style={{ marginBottom: 12 }}>
                {renderTransaction({ item })}
             </View>
          ))}

          {/* Sign Out Button */}
          <View style={styles.footer}>
             <GlassButton title="Sign Out" onPress={logout} variant="secondary" />
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    opacity: 0.9,
  },
  balanceCard: {
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  xpBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  xpBar: {
    height: '100%',
    borderRadius: 3,
  },
  xpText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionCard: {
    padding: 16,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  transactionItem: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
  },
  buyButtonContainer: {
    marginTop: 24,
    width: '100%',
  },
});
