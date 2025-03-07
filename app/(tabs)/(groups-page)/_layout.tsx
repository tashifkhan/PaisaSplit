import { Stack } from 'expo-router/stack';
import { Platform, useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
        animationDuration: 200,
        presentation: 'card',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    />
  );
}
