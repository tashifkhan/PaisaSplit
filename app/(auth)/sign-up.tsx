import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { AuthInput } from '@/components/AuthInput'; // Added import

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    // TODO: Implement sign up logic
    console.log('Sign up with:', { name, email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Create account
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colorScheme === 'dark' ? '#666' : '#999' },
            ]}
          >
            Sign up to get started
          </Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            iconName="person"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <AuthInput
            iconName="mail"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <AuthInput
            iconName="lock-closed"
            placeholder="Password"
            isPassword
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={[styles.signUpButton, { backgroundColor: colors.tint }]}
            onPress={handleSignUp}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: colorScheme === 'dark' ? '#666' : '#999' },
              ]}
            >
              Already have an account?{' '}
            </Text>
            <Link href="/sign-in" asChild>
              <Pressable>
                <Text style={[styles.footerLink, { color: colors.tint }]}>
                  Sign In
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
  },
  form: {
    gap: 16,
  },
  signUpButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '600',
  },
});
