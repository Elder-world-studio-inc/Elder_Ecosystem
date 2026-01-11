import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function SubscriptionScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-between p-6">
      <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-12 left-6 z-10">
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      <View className="items-center mt-20">
        <View className="w-24 h-24 bg-indigo-600 rounded-full items-center justify-center mb-6 shadow-lg shadow-indigo-500/50">
            <Ionicons name="diamond" size={40} color="white" />
        </View>
        <Text className="text-3xl font-bold text-white text-center mb-2">Upgrade to Pro</Text>
        <Text className="text-slate-400 text-center text-lg px-4">
          You've reached your free limit of 5 scans. Unlock unlimited AI generation now.
        </Text>
      </View>

      <View className="space-y-4">
        <View className="flex-row items-center space-x-4 bg-slate-800 p-4 rounded-xl">
            <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
            <Text className="text-white font-bold text-lg">Unlimited Scans</Text>
        </View>
        <View className="flex-row items-center space-x-4 bg-slate-800 p-4 rounded-xl">
            <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
            <Text className="text-white font-bold text-lg">Advanced AI Models</Text>
        </View>
        <View className="flex-row items-center space-x-4 bg-slate-800 p-4 rounded-xl">
            <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
            <Text className="text-white font-bold text-lg">Priority Support</Text>
        </View>
      </View>

      <TouchableOpacity className="bg-indigo-600 p-4 rounded-xl mb-8">
        <Text className="text-white text-center font-bold text-xl">Subscribe for $9.99/mo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
