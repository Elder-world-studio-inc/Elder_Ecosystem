import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function ResultsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { result } = route.params;
  const [activeTab, setActiveTab] = useState<'meta' | 'tiktok' | 'google'>('meta');

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const renderMeta = () => (
    <View className="space-y-4">
      {result.meta.map((ad: any, index: number) => (
        <View key={index} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <Text className="text-indigo-400 font-bold mb-2">Option {index + 1}</Text>
          <Text className="text-white font-bold text-lg mb-2">{ad.headline}</Text>
          <Text className="text-slate-300 leading-6">{ad.body}</Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(`${ad.headline}\n\n${ad.body}`)}
            className="mt-4 bg-slate-700 p-2 rounded-lg items-center"
          >
            <Text className="text-white text-xs font-bold">Copy</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderTikTok = () => (
    <View className="space-y-4">
      {result.tiktok.map((script: string, index: number) => (
        <View key={index} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <Text className="text-pink-500 font-bold mb-2">Script {index + 1}</Text>
          <Text className="text-slate-300 leading-6">{script}</Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(script)}
            className="mt-4 bg-slate-700 p-2 rounded-lg items-center"
          >
            <Text className="text-white text-xs font-bold">Copy</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderGoogle = () => (
    <View className="space-y-4">
      {result.google.map((headline: string, index: number) => (
        <View key={index} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <Text className="text-blue-400 font-bold mb-2">Headline {index + 1}</Text>
          <Text className="text-white font-bold text-lg">{headline}</Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(headline)}
            className="mt-4 bg-slate-700 p-2 rounded-lg items-center"
          >
            <Text className="text-white text-xs font-bold">Copy</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-row items-center justify-between p-4 border-b border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">Generated Copy</Text>
        <View className="w-6" />
      </View>

      <View className="flex-row p-4 space-x-2">
        {['meta', 'tiktok', 'google'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === tab ? 'bg-indigo-600' : 'bg-slate-800'}`}
          >
            <Text className={`font-bold capitalize ${activeTab === tab ? 'text-white' : 'text-slate-400'}`}>
                {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4">
        {activeTab === 'meta' && renderMeta()}
        {activeTab === 'tiktok' && renderTikTok()}
        {activeTab === 'google' && renderGoogle()}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
