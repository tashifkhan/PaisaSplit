import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function FAQScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const socialLinks = [
    {
      icon: 'logo-github',
      title: 'GitHub',
      url: 'https://github.com/tashifkhan/PaisaSplit',
    },
    {
      icon: 'logo-linkedin',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/tashif-ahmad-khan-982304244/',
    },
    {
      icon: 'logo-instagram',
      title: 'Instagram',
      url: 'https://instagram.com/khan_tashif',
    },
    {
      icon: 'globe-outline',
      title: 'Portfolio',
      url: 'https://portfolio.tashif.codes',
    },
  ];

  const faqs = [
    {
      question: 'What is PaisaSplit?',
      answer:
        'PaisaSplit is a modern expense sharing app that helps you track and split expenses with friends, family, and roommates.',
    },
    {
      question: 'How do I create a group?',
      answer:
        'Tap on the Groups tab and click the "+" button to create a new group. Add members and start splitting expenses!',
    },
    {
      question: 'How are expenses calculated?',
      answer:
        'PaisaSplit uses smart algorithms to ensure fair expense distribution. You can split equally or by custom percentages.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Yes! We use industry-standard encryption to protect your data and never share it with third parties.',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <BlurView intensity={80} style={styles.backButtonBlur}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </BlurView>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>
          Help & Support
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Connect With Me
        </Text>
        <View style={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.socialButton,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={() => Linking.openURL(link.url)}
            >
              <Ionicons name={link.icon as any} size={24} color={colors.tint} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                {link.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>FAQ</Text>
        {faqs.map((faq, index) => (
          <View
            key={index}
            style={[
              styles.faqItem,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
            ]}
          >
            <Text style={[styles.question, { color: colors.text }]}>
              {faq.question}
            </Text>
            <Text
              style={[
                styles.answer,
                { color: colorScheme === 'dark' ? '#666' : '#999' },
              ]}
            >
              {faq.answer}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  backButton: {
    zIndex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonBlur: {
    padding: 6,
    borderRadius: 16,
  },
  section: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  faqItem: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  question: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    fontSize: 15,
    lineHeight: 20,
  },
});
