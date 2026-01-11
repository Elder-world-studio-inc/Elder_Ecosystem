import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { GlassView } from './GlassView';
import { useTheme } from '../../context/ThemeContext';

interface GlassInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  label?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}

export const GlassInput: React.FC<GlassInputProps> = ({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry,
  label,
  keyboardType
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, { color: colors.secondaryText }]}>{label}</Text>}
      <GlassView style={styles.container} intensity={20}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    borderRadius: 12,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
});
