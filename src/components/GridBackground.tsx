import React from 'react';
import { View } from 'react-native';

export function GridBackground() {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden opacity-10 dark:opacity-5" pointerEvents="none">
      {Array.from({ length: 40 }).map((_, i) => (
        <View key={`h-${i}`} className="w-full h-[1px] bg-blue-900 absolute" style={{ top: i * 30 }} />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <View key={`v-${i}`} className="h-full w-[1px] bg-blue-900 absolute" style={{ left: i * 30 }} />
      ))}
    </View>
  );
}
