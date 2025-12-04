import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function AppButton({
  title,
  variant = 'primary',
  isLoading = false,
  icon,
  disabled,
  ...props
}: AppButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600';
      case 'secondary':
        return 'bg-gray-600';
      case 'outline':
        return 'bg-transparent border-2 border-blue-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
        return 'text-blue-600';
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || isLoading}
      className={`rounded-xl py-4 px-6 flex-row justify-center items-center ${getVariantStyles()} ${
        disabled || isLoading ? 'opacity-50' : ''
      }`}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563eb' : 'white'} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text className={`font-semibold text-lg ${getTextStyles()}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
