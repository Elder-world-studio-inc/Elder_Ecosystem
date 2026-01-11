import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<any>();
  const { user, refreshUser } = useAuth();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <Text className="text-white text-center mb-4">We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-indigo-600 px-6 py-3 rounded-lg">
          <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        if (photo?.base64) {
            setCapturedImage(photo.base64);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setCapturedImage(result.assets[0].base64);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    if ((user?.scan_count || 0) >= 5 && !user?.is_elite) {
        navigation.navigate('Subscription');
        return;
    }

    setAnalyzing(true);
    try {
      const response = await api.post('/adcam/analyze', { image: capturedImage });
      await refreshUser();
      navigation.navigate('Results', { result: response.data.result });
      setCapturedImage(null); // Reset after success
    } catch (error: any) {
      if (error.response?.status === 403) {
        navigation.navigate('Subscription');
      } else {
        Alert.alert('Analysis Failed', error.message);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  if (capturedImage) {
    return (
      <View className="flex-1 bg-slate-900">
        <Image 
            source={{ uri: `data:image/jpg;base64,${capturedImage}` }} 
            className="flex-1 w-full h-full" 
            resizeMode="contain"
        />
        <View className="absolute bottom-0 w-full p-6 bg-black/50 flex-row justify-between items-center">
            <TouchableOpacity 
                onPress={() => setCapturedImage(null)}
                className="bg-slate-700 p-4 rounded-full"
            >
                <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={analyzeImage}
                disabled={analyzing}
                className="bg-indigo-600 px-8 py-4 rounded-xl flex-row items-center"
            >
                {analyzing ? (
                    <ActivityIndicator color="white" className="mr-2" />
                ) : (
                    <Ionicons name="sparkles" size={20} color="white" className="mr-2" />
                )}
                <Text className="text-white font-bold text-lg">
                    {analyzing ? 'Analyzing...' : 'Generate Ads'}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        style={{ flex: 1 }} 
        facing={facing as any}
        ref={cameraRef}
      >
        <SafeAreaView className="flex-1 justify-between p-6">
            <View className="flex-row justify-between items-center">
                 <View className="bg-black/40 px-3 py-1 rounded-full">
                    <Text className="text-white font-bold">{user?.scan_count || 0}/5 Scans</Text>
                 </View>
                 <TouchableOpacity onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
                    <Ionicons name="camera-reverse" size={30} color="white" />
                 </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center mb-8">
                <TouchableOpacity onPress={pickImage} className="bg-slate-800/80 p-4 rounded-full">
                    <Ionicons name="images" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={takePicture}
                    className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 items-center justify-center"
                >
                    <View className="w-16 h-16 bg-white rounded-full border-2 border-black" />
                </TouchableOpacity>

                <View className="w-12" /> 
            </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
