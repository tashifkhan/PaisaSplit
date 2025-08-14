import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
  PressableProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface OptionCardProps extends PressableProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export function OptionCard({
  iconName,
  title,
  description,
  onPress,
  ...rest
}: OptionCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
        },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title} // Use title for accessibility label
      {...rest}
    >
      <View style={styles.cardIcon}>
        <Ionicons name={iconName} size={48} color={colors.tint} />
      </View>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.cardDescription, { color: colors.text }]}>
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    minHeight: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Add gap or margin if these cards are used in a container with gap
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  cardIcon: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
