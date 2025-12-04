import React from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'dark';
}

export default function Card({ 
  children, 
  onPress, 
  variant = 'default',
  className = '',
  style,
  ...props 
}: CardProps) {
  const isDark = variant === 'dark';
  const baseStyles = `rounded-2xl p-4 ${
    isDark ? '' : variant === 'elevated' ? 'shadow-md' : 'border border-gray-200'
  } ${className}`;
  
  const backgroundColor = isDark ? '#2f3b52' : '#ffffff';

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} className={baseStyles} style={[{ backgroundColor }, style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View {...props} className={baseStyles} style={[{ backgroundColor }, style]}>
      {children}
    </View>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <View className="mb-3">{children}</View>;
}

export function CardTitle({ children, dark }: { children: string; dark?: boolean }) {
  return <Text className="text-xl font-bold" style={{ color: dark ? '#ffffff' : '#111827' }}>{children}</Text>;
}

export function CardDescription({ children, dark }: { children: string; dark?: boolean }) {
  return <Text className="text-sm mt-1" style={{ color: dark ? '#9ca3af' : '#4b5563' }}>{children}</Text>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <View className="mb-3">{children}</View>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <View className="mt-3 pt-3 border-t border-gray-100">{children}</View>;
}
