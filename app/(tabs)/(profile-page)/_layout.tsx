import { Stack } from 'expo-router/stack';
import { Platform, useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        presentation: 'card',
        headerShown: false,
        animationDuration: 3,
      }}
    />
  );
}
