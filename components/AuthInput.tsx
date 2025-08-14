import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors'; // Assuming you might want to use this for colors
import { useColorScheme } from 'react-native';

interface AuthInputProps extends TextInputProps {
  iconName: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  showPassword?: boolean;
  onToggleShowPassword?: () => void;
}

export function AuthInput({
  iconName,
  isPassword,
  showPassword,
  onToggleShowPassword,
  style,
  placeholderTextColor,
  ...rest
}: AuthInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const defaultPlaceholderTextColor = colorScheme === 'dark' ? '#666' : '#999';

  return (
    <View
      style={[
        styles.inputGroup,
        {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={colors.text}
        style={styles.inputIcon}
      />
      <TextInput
        placeholderTextColor={
          placeholderTextColor || defaultPlaceholderTextColor
        }
        style={[styles.input, { color: colors.text }, style]}
        secureTextEntry={isPassword && !showPassword}
        {...rest}
      />
      {isPassword && onToggleShowPassword && (
        <Pressable
          onPress={onToggleShowPassword}
          style={styles.showPasswordButton}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color={defaultPlaceholderTextColor}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    padding: 0,
  },
  showPasswordButton: {
    padding: 4,
  },
});
