import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center p-6">
      <View>
        <Text className="text-4xl font-bold text-white mb-2 text-center">Skry Ad Cam</Text>
        <Text className="text-slate-400 text-center mb-10">AI-Powered Ad Copy Generator</Text>

        <View className="space-y-4">
          <View>
            <Text className="text-white mb-2 ml-1">Username</Text>
            <TextInput
              className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
              placeholder="Enter username"
              placeholderTextColor="#64748b"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View className="mt-4">
            <Text className="text-white mb-2 ml-1">Password</Text>
            <TextInput
              className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
              placeholder="Enter password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="bg-indigo-600 p-4 rounded-xl mt-8"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
