import React, { useState, useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Animated, 
  Modal, 
  TextInput 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useRouter } from 'expo-router';

// Assume these functions are imported from your API module.
import { getAllergies, addAllergy, removeAllergy } from '@/constants/api';

interface Allergen {
  id: string;
  name: string;
}

const Allergens = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newAllergenName, setNewAllergenName] = useState('');

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const result = await getAllergies();
        // If result is an array of strings, map each to an object with a unique id.
        const allergenList = result.map((allergen: string, index: number) => ({
          id: index.toString(), // Use index (or a better unique value if available)
          name: allergen,
        }));
        setAllergens(allergenList);
      } catch (error) {
        console.error('Failed to load allergies:', error);
      }
    };
    fetchAllergies();
  }, []);

  const handleAddAllergen = async () => {
    if (newAllergenName.trim() !== '') {
      try {
        await addAllergy(newAllergenName);
        // Create a new allergen object with a unique id.
        const newAllergen: Allergen = { id: Date.now().toString(), name: newAllergenName };
        setAllergens(prev => [...prev, newAllergen]);
        setNewAllergenName('');
        setModalVisible(false);
      } catch (error) {
        console.error('Failed to add allergen:', error);
      }
    }
  };

  // const deleteItem = async (id: string) => {
  //   try {
  //     await removeAllergy(id);
  //     setAllergens(prev => prev.filter(item => item.id !== id));
  //   } catch (error) {
  //     console.error('Failed to remove allergen:', error);
  //   }
  // };
  const deleteItem = async (allergenName: string) => {
    try {
      await removeAllergy(allergenName);
      setAllergens(prev => prev.filter(item => item.name !== allergenName));
    } catch (error) {
      console.error('Failed to remove allergen:', error);
    }
  };

  // const renderRightActions = (
  //   progress: Animated.AnimatedInterpolation,
  //   dragX: Animated.AnimatedInterpolation,
  //   itemId: string
  // ) => (
  //   <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(itemId)}>
  //     <Text style={styles.deleteText}>Delete</Text>
  //   </TouchableOpacity>
  // );
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation,
    itemName: string
  ) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(itemName)}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  // const renderItem = ({ item }: { item: Allergen }) => (
  //   // Add the key prop to the top-level Swipeable component
  //   <Swipeable key={item.id} renderRightActions={(progress, dragX) =>
  //     renderRightActions(progress, dragX, item.id)
  //   }>
  //     <View style={styles.itemContainer}>
  //       <Text style={styles.itemText}>{item.name}</Text>
  //     </View>
  //   </Swipeable>
  // );
  const renderItem = ({ item }: { item: Allergen }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item.name)
      }
    >
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
    {/* <View style={styles.container}> */}
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Allergens</Text>
        <TouchableOpacity onPress={() => router.push('/conditions')}>
          <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* FlatList with keyExtractor using the unique id */}
      <FlatList
        data={allergens}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab]} onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={24} color="black" />
      </TouchableOpacity>

      {/* Modal for Adding New Allergen */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Allergen</Text>
            <TextInput
              style={styles.input}
              placeholder="Allergen name"
              value={newAllergenName}
              onChangeText={setNewAllergenName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddAllergen}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    {/* </View> */}
    </SafeAreaView>
  );
};

export default Allergens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: -440,
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
