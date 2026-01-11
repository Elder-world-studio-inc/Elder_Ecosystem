import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStripe } from '@stripe/stripe-react-native';
import { GlassView } from '../components/ui/GlassView';
import { GlassButton } from '../components/ui/GlassButton';
import { useTheme } from '../context/ThemeContext';
import { NexusService } from '../services/NexusService';

const SHARD_PACKS = [
  {
    id: 'test_pack',
    name: 'Test Shard',
    shards: 10,
    price: 0.50,
    priceCents: 50,
    description: 'Sandbox Mode Test'
  },
  {
    id: 'wanderer_pouch',
    name: "Wanderer's Pouch",
    shards: 100,
    price: 4.99,
    priceCents: 499,
    description: 'A small pouch of condensed aether.'
  },
  {
    id: 'knights_cache',
    name: "Knight's Cache",
    shards: 500,
    price: 19.99,
    priceCents: 1999,
    description: 'Enough supplies for a long campaign.'
  },
];

export const ShardStoreScreen = ({ navigation }: any) => {
  const { colors, gradients } = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const handleBuy = async (pack: typeof SHARD_PACKS[0]) => {
    setLoading(true);
    try {
      // 1. Fetch PaymentIntent from backend
      const { paymentIntent, customer, ephemeralKey } = await NexusService.createPaymentIntent(pack.priceCents);

      // 2. Initialize Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'Elder Worlds Studio',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        returnURL: 'elderworlds://stripe-redirect', // Optional
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        setLoading(false);
        return;
      }

      // 3. Present Payment Sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Payment Cancelled', paymentError.message);
      } else {
        // 4. Success! Update backend balance
        await NexusService.confirmPurchase(pack.shards, pack.name);
        Alert.alert('Success', `You received ${pack.shards} Shards!`);
        navigation.goBack(); // Return to previous screen (e.g. Vault)
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong with the purchase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={gradients.dashboard} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Shard Store</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Acquire resources for your journey
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {SHARD_PACKS.map((pack) => (
            <GlassView key={pack.id} style={styles.card} intensity={30}>
              <View style={styles.cardContent}>
                <View style={styles.packInfo}>
                  <Text style={[styles.packName, { color: colors.primary }]}>{pack.name}</Text>
                  <Text style={[styles.packDesc, { color: colors.secondaryText }]}>{pack.description}</Text>
                  <Text style={[styles.shardCount, { color: colors.success }]}>+{pack.shards} Shards</Text>
                </View>
                <View style={styles.buyButtonContainer}>
                  <GlassButton
                    title={`$${pack.price.toFixed(2)}`}
                    onPress={() => handleBuy(pack)}
                    loading={loading}
                    variant="primary"
                  />
                </View>
              </View>
            </GlassView>
          ))}
        </ScrollView>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
           <Text style={{ color: colors.secondaryText }}>Close Store</Text>
        </TouchableOpacity>
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
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  content: {
    padding: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packInfo: {
    flex: 1,
    marginRight: 16,
  },
  packName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  packDesc: {
    fontSize: 12,
    marginBottom: 8,
  },
  shardCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyButtonContainer: {
    width: 100,
  },
  closeButton: {
    alignItems: 'center',
    padding: 24,
  }
});
