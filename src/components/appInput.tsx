import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export default function AppInput({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  ...props
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-2 ml-1">{label}</Text>
      )}
      
      <View
        className={`flex-row items-center bg-gray-50 rounded-xl px-4 py-3 ${
          isFocused ? 'border-2 border-blue-600' : 'border border-gray-200'
        } ${error ? 'border-red-500' : ''}`}
      >
        {icon && <View className="mr-2">{icon}</View>}
        
        <TextInput
          {...props}
          className="flex-1 text-gray-900 text-base"
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
