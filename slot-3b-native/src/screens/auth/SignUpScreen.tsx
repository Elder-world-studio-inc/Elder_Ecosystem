import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SignUpScreen = () => {
  const navigation = useNavigation<any>();
  const { signup } = useAuth();
  const { colors, gradients } = useTheme();
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signup({ fullName, username, email, password });
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={gradients.dashboard} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Join the Realm</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Begin your journey
            </Text>
          </View>

          <View style={styles.form}>
            <GlassInput
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />
            <GlassInput
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
            />
            <GlassInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <GlassInput
              label="Password"
              placeholder="Choose a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.spacer} />

            <GlassButton 
              title="Create Account" 
              onPress={handleSignUp} 
              loading={loading}
            />

            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={styles.footerLink}
            >
              <Text style={{ color: colors.secondaryText }}>
                Already have an account? <Text style={{ color: colors.primary }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
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
    flexGrow: 1,
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
    height: 24,
  },
  footerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
});
