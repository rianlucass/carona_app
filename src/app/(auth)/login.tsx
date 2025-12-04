import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text } from 'react-native';

export default function Login() {
  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <Text>Login Screen</Text>
    </View>
  );
}