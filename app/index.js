import { useTheme } from "@/context/ThemeContext"
import { MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Button, FlatList, Image, Keyboard, KeyboardAvoidingView, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

const API_BASE = 'https://foodapp-1-b6x1.onrender.com'

const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'

const Index = () => {
  const router = useRouter()
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [isGrid, setIsGrid] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { isDarkMode, toggleTheme } = useTheme();

  const fetchData = () => {
    axios
      .get(`${API_BASE}/api/foods`)
      .then((res) => setData(res.data))
      .catch((err) => console.log('API Error:', err))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    axios
      .get(`${API_BASE}/api/foods`)
      .then((res) => setData(res.data))
      .catch((err) => console.log('API Error:', err))
      .finally(() => setRefreshing(false))
  }

  const openEditModal = (item) => {
    setSelectedItem(item)
    setEditName(item.name)
    setEditPrice(item.price.toString())
    setModalVisible(true)
  }

  const saveEdit = () => {
    if (!editName || !editPrice) {
      Alert.alert('Error', 'Name and Price cannot be empty')
      return
    }

    console.log('Updating item:', selectedItem._id, 'Name:', editName, 'Price:', editPrice)

    axios
      .put(`${API_BASE}/api/foods/${selectedItem._id}`, {
        name: editName,
        price: Number(editPrice)
      })
      .then((res) => {
        console.log('Update response:', res.data)
        Alert.alert('Success', 'Item updated successfully')
        setModalVisible(false)
        fetchData()
      })
      .catch((err) => {
        console.log('Update Error:', err)
        Alert.alert('Error', 'Failed to update item. Check console for details.')
      })
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item._id || index}
      style={[styles.card, isGrid ? styles.gridCard : styles.listCard, isDarkMode && styles.cardDark]}
      onPress={() =>
        router.push({
          pathname: '/about',
          params: {
            title: item.name,
            description: item.name,
            price: item.price,
            image: item.imageUrl || DEFAULT_IMAGE_URL
          }
        })
      }
      onLongPress={() => openEditModal(item)}
    >
      <Image
        source={{
          uri: item.imageUrl || DEFAULT_IMAGE_URL
        }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={[styles.itemName, isDarkMode && styles.itemNameDark]}>{item.name}</Text>
        <Text style={[styles.itemPrice, isDarkMode && styles.itemPriceDark]}>₹ {item.price}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={[styles.heading, isDarkMode ? styles.headingDark : styles.headingLight]}>✌🏼Hi Haśśan</Text>
        </TouchableOpacity>
        <Switch
          value={isGrid}
          onValueChange={setIsGrid}
          trackColor={{ false: '#ccc', true: '#00a7e1' }}
          thumbColor={isGrid ? '#fff' : '#f5f5f5'}
          ios_backgroundColor="#3e3e3e"
          style={styles.switchStyle}
        />
      </View>
      <View style={{ marginBottom: 15 }}>
        <View style={{ position: 'relative', justifyContent: 'center' }}>
          <TextInput
            placeholder="Search food..."
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                borderRadius: 22,
                paddingRight: 50,
                height: 44,
              },
            ]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 10,
                height: 36,
                width: 36,
                borderRadius: 18,
                // backgroundColor: '#aae5f968',
                justifyContent: 'center',
                alignItems: 'center',
                top: '40%',
                transform: [{ translateY: -18 }],
              }}
            >
              <MaterialIcons name="clear" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        numColumns={isGrid ? 2 : 1}
        columnWrapperStyle={isGrid ? styles.grid : null}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 100 }}
        key={isGrid ? 'g' : 'l'}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && { backgroundColor: '#1e1e1e' }]}>
            <Text style={{ fontWeight: '800', fontSize: 22, marginBottom: 18, textAlign: 'center', color: '#00a7e1' }}>Edit Item</Text>
            <TextInput
              placeholder="Name"
              value={editName}
              onChangeText={setEditName}
              style={[styles.input, isDarkMode && { color: '#fff', placeholderTextColor: '#aaa' }]}
            />
            <TextInput
              placeholder="Price"
              value={editPrice}
              onChangeText={setEditPrice}
              keyboardType="numeric"
              style={[styles.input, isDarkMode && { color: '#fff', placeholderTextColor: '#aaa' }]}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={addModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && { backgroundColor: '#1e1e1e' }]}>
            <Text style={{ fontWeight: '800', fontSize: 22, marginBottom: 18, textAlign: 'center', color: '#00a7e1' }}>Add New Food</Text>

            <TextInput
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
              style={[styles.input, isDarkMode && { color: '#fff', placeholderTextColor: '#aaa' }]}
            />

            <TextInput
              placeholder="Price"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
              style={[styles.input, isDarkMode && { color: '#fff', placeholderTextColor: '#aaa' }]}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <Button title="Cancel" onPress={() => setAddModalVisible(false)} />
              <Button
                title="Save"
                onPress={() => {
                  // Validation
                  if (!newName || !newPrice) {
                    Alert.alert('Error', 'Name and Price cannot be empty');
                    return;
                  }

                  // Send data to backend
                  axios
                    .post(`${API_BASE}/api/foods`, {
                      name: newName,
                      price: Number(newPrice),
                      imageUrl: DEFAULT_IMAGE_URL // you can add more fields here if needed
                    })
                    .then((res) => {
                      Alert.alert('Success', 'Food added successfully');
                      // Reset inputs
                      setNewName('');
                      setNewPrice('');
                      setAddModalVisible(false);
                      // Refresh list
                      fetchData();
                    })
                    .catch((err) => {
                      console.log('Add Error:', err);
                      Alert.alert('Error', 'Failed to add food. Check console for details.');
                    });
                }}
              />
            </View>
          </View>
        </View>
      </Modal>


    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  containerLight: {
    backgroundColor: 'white',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 5,
    backgroundColor: 'transparent',
  },
  switchStyle: {
    marginLeft: 12,
    marginTop: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00a7e1',
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  toggleActive: {
    backgroundColor: '#00a7e1',
  },
  toggleInactive: {
    backgroundColor: '#fff',
  },
  toggleSingleButton: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00a7e1',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontWeight: '700',
    fontSize: 15,
  },
  toggleTextActive: {
    color: '#fff',
  },
  toggleTextInactive: {
    color: '#00a7e1',
  },
  heading: {
    fontSize: 32,
    fontWeight: '900',
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  headingLight: {
    color: '#000',
  },
  headingDark: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  card: {
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  gridCard: {
    width: '48%',
  },
  listCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 8
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  itemNameDark: {
    color: '#eee',
  },
  itemPrice: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
    color: 'green'
  },
  itemPriceDark: {
    color: '#90ee90',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
    width: '90%',
    alignSelf: 'center'
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#00a7e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  cartContainer: {
    flex: 1,
    backgroundColor: '#ed7676ff', // replace with your desired color
    padding: 20
  },
})
