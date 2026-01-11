import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/Auth/LoginScreen';
import CameraScreen from '../screens/Main/CameraScreen';
import ResultsScreen from '../screens/Main/ResultsScreen';
import SubscriptionScreen from '../screens/Paywall/SubscriptionScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen 
                name="Subscription" 
                component={SubscriptionScreen} 
                options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
