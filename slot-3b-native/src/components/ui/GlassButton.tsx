import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { GlassView } from './GlassView';
import { useTheme } from '../../context/ThemeContext';

interface GlassButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const GlassButton: React.FC<GlassButtonProps> = ({ 
  onPress, 
  title, 
  loading = false,
  variant = 'primary'
}) => {
  const { colors, gradients } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <GlassView 
        style={styles.container} 
        intensity={40}
        gradient={variant === 'primary' ? gradients.buttonPrimary : undefined}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.text, { color: variant === 'primary' ? '#000' : colors.text }]}>
            {title}
          </Text>
        )}
      </GlassView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
