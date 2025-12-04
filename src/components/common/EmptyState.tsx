import React from 'react';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export default function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-xl font-bold text-gray-900 text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-gray-600 text-center">
          {description}
        </Text>
      )}
    </View>
  );
}
