import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { GlassView } from '../components/ui/GlassView';

import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const { colors, gradients, spacing, typography } = useTheme();
  const navigation = useNavigation();

  return (
    <LinearGradient colors={gradients.dashboard} locations={gradients.dashboardLocations} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.xl }]}>
          
          {/* Header */}
          <GlassView style={[styles.header, { marginBottom: spacing.xl }]} intensity={30} gradient={['rgba(18, 38, 70, 0.9)', 'rgba(7, 10, 26, 0.96)']}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.s }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s }}>
                <View style={[styles.brandMark, { borderColor: colors.primary, backgroundColor: colors.primaryGlow }]} />
                <View>
                  <Text style={[styles.brandText, { color: colors.primary, fontSize: typography.sizes.s, fontWeight: '700' }]}>OMNIVAEL</Text>
                  <Text style={[styles.brandText, { color: colors.secondary, fontSize: 9, fontWeight: '500' }]}>UNIVERSE</Text>
                </View>
              </View>
              <View style={[styles.walletBadge, { borderColor: colors.primary, backgroundColor: colors.glassDark }]}>
                <Text style={{ color: colors.secondaryText, fontSize: 9 }}>TOKENS</Text>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>2,450</Text>
              </View>
            </View>
          </GlassView>

          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: colors.glassDark, borderColor: colors.borderLight, marginBottom: spacing.xl }]}>
            <Text style={{ color: colors.secondary, fontSize: typography.sizes.s }}>Search comics, stories, lore...</Text>
          </View>

          {/* Continue Reading Section */}
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.l, marginBottom: spacing.l }]}>CONTINUE READING</Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('Reader')}>
            <GlassView style={{ padding: spacing.l }}>
              <View style={{ flexDirection: 'row', gap: spacing.l }}>
                <View style={{ flex: 1, gap: spacing.s }}>
                  <Text style={{ color: colors.primary, fontSize: typography.sizes.xs, letterSpacing: 2 }}>COMIC</Text>
                  <Text style={{ color: colors.text, fontSize: typography.sizes.m, fontWeight: '600' }}>The Crystal Vanguard</Text>
                  <View style={{ flexDirection: 'row', marginTop: spacing.s }}>
                    <LinearGradient colors={gradients.buttonPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 999, paddingVertical: 8, paddingHorizontal: 20 }}>
                        <Text style={{ color: '#05101f', fontWeight: 'bold', fontSize: typography.sizes.xs, letterSpacing: 1 }}>RESUME EP. 4</Text>
                    </LinearGradient>
                  </View>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: colors.primary }}>85%</Text>
                  </View>
                </View>
              </View>
            </GlassView>
          </TouchableOpacity>

          {/* Featured Section */}
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.l, marginTop: spacing.xxl, marginBottom: spacing.l }]}>FEATURED</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m }}>
             {[1, 2, 3, 4].map((i) => (
                <GlassView key={i} style={{ width: '47%', aspectRatio: 0.7, marginBottom: spacing.m }} borderOpacity={0.6}>
                   <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                   <View style={{ padding: spacing.s }}>
                      <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: '600' }}>TITLE {i}</Text>
                   </View>
                </GlassView>
             ))}
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    borderRadius: 999,
  },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
  },
  brandText: {
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  searchContainer: {
    padding: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: '500',
    letterSpacing: 1,
  },
});
