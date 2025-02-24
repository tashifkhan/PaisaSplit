import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AddExpense from '@/components/AddExpense';
import GroupModal from '@/components/GroupModal';
import { scanBill } from '@/utils/ocr';

export default function AddExpenseScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleOptionPress = async (type: 'scan' | 'manual') => {
    if (type === 'scan') {
      try {
        setIsScanning(true);
        const result = await scanBill();
        setIsScanning(false);
        setIsModalVisible(true);
        // Pass OCR result to AddExpense component
        // You'll need to modify your AddExpense component to accept initial values
      } catch (error) {
        setIsScanning(false);
        // Handle error appropriately
        console.error('Scanning failed:', error);
      }
    } else {
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCloseGroupModal = () => {
    setIsGroupModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {isScanning && (
        <View style={styles.scanningOverlay}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.scanningText, { color: colors.text }]}>
            Scanning bill...
          </Text>
        </View>
      )}
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Add Expense
          </Text>
        </View>

        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          <Pressable
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
              pressed && styles.cardPressed,
            ]}
            onPress={() => setIsGroupModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Create Group"
          >
            <View style={styles.cardIcon}>
              <Ionicons name="people" size={48} color={colors.tint} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Create Group
            </Text>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Create a new group to split expenses
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleOptionPress('manual')}
            accessibilityRole="button"
            accessibilityLabel="Enter Manually"
          >
            <View style={styles.cardIcon}>
              <Ionicons name="create-outline" size={48} color={colors.tint} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Enter Manually
            </Text>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Add expense details manually
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleOptionPress('scan')}
            accessibilityRole="button"
            accessibilityLabel="Scan Bill"
          >
            <View style={styles.cardIcon}>
              <Ionicons name="scan-outline" size={48} color={colors.tint} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Scan Bill
            </Text>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Quickly scan your receipt to add expenses
            </Text>
          </Pressable>
        </View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackground}
              onPress={handleCloseModal}
            />
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
            >
              <AddExpense onClose={handleCloseModal} />
            </View>
          </View>
        </Modal>

        <Modal
          visible={isGroupModalVisible}
          animationType="slide"
          transparent
          onRequestClose={handleCloseGroupModal}
        >
          <View style={styles.modalOverlay}>
            <Pressable
              style={styles.modalBackground}
              onPress={handleCloseGroupModal}
            />
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
            >
              <GroupModal onClose={handleCloseGroupModal} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },

  content: {
    padding: 24,
    gap: 24,
  },
  contentDesktop: {
    maxWidth: 800,
    alignSelf: 'center',
    flexDirection: 'row',
  },
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    width: '100%',
    overflow: 'hidden',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scanningText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});
