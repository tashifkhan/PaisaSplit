import { Stack } from 'expo-router/stack';
import { Platform } from 'react-native';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
        animationDuration: 200,
        presentation: 'card',
        contentStyle: {
          backgroundColor: Platform.OS === 'android' ? '#fff' : 'transparent',
        },
      }}
    />
  );
}
