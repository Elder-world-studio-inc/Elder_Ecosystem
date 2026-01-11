import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

interface GlassViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  gradient?: readonly string[];
  borderOpacity?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({ 
  children, 
  style, 
  intensity = 20,
  gradient,
  borderOpacity = 0.45 
}) => {
  const { colors, gradients, shadows } = useTheme();

  // Default to card gradient if none provided
  const backgroundGradient = gradient || gradients.card;

  return (
    <View style={[styles.container, { borderColor: `rgba(84, 137, 255, ${borderOpacity})` }, style]}>
      {/* Blur Layer */}
      <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint="dark" />
      
      {/* Gradient Tint Layer */}
      <LinearGradient 
        colors={backgroundGradient} 
        style={StyleSheet.absoluteFill} 
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 1,
    position: 'relative',
  },
  content: {
    // Ensure content sits above the absolute positioned background layers
    zIndex: 1,
  },
});
