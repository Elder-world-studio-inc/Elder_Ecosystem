import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AuthService } from '../../services/AuthService';
import { useTheme } from '../../context/ThemeContext';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, gradients } = useTheme();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const message = await AuthService.forgotPassword(email);
      Alert.alert('Success', message, [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={gradients.dashboard} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Reset Access</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Enter your email to receive a reset code
          </Text>
        </View>

        <View style={styles.form}>
          <GlassInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.spacer} />

          <GlassButton 
            title="Send Reset Code" 
            onPress={handleReset} 
            loading={loading}
          />

          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.footerLink}
          >
            <Text style={{ color: colors.primary }}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  spacer: {
    height: 16,
  },
  footerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
});
