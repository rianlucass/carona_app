import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text } from 'react-native';

export default function SearchRides() {
    return (
        <View className="flex-1">
            <StatusBar style="dark" />
            <Text>Search Rides Screen</Text>
        </View>
    );
}