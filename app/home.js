// const API_BASE = 'https://your-deployed-backend-domain.com';
// import { useTheme } from "@/context/ThemeContext";
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';




// const home = () => {
//   const { isDarkMode } = useTheme();
//   const router = useRouter();
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [imageUrl, setImageUrl] = useState('');

//   const saveData = () => {
//     if (!name || !price || !imageUrl) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }

//     axios.post(`${API_BASE}/api/auth/addfood`, {
//       name,
//       price: Number(price),
//       imageUrl
//     })
//     .then(res => {
//       Alert.alert('Success', 'Food saved successfully');
//       setName('');
//       setPrice('');
//       setImageUrl('');
//     })
//     .catch(err => {
//       console.log('Save Error:', err);
//       Alert.alert('Error', 'Failed to save food');
//     });
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}
//     >
//       <ScrollView contentContainerStyle={[styles.content, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
//         <TouchableOpacity
//           onPress={() => router.back()}
//           style={{
//             marginTop: 50,
//             paddingVertical: 6,
//             paddingHorizontal: 6,
//             alignSelf: 'flex-start'
//           }}
//         >
//           <Ionicons name="chevron-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
//         </TouchableOpacity>
//         <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Add New Food</Text>

//         <TextInput
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//           style={[
//             styles.input,
//             { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', color: isDarkMode ? '#fff' : '#000' }
//           ]}
//           placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
//         />
//         <TextInput
//           placeholder="Price"
//           value={price}
//           onChangeText={setPrice}
//           keyboardType="numeric"
//           style={[
//             styles.input,
//             { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', color: isDarkMode ? '#fff' : '#000' }
//           ]}
//           placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
//         />
//         <TextInput
//           placeholder="Image URL"
//           value={imageUrl}
//           onChangeText={setImageUrl}
//           style={[
//             styles.input,
//             { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', color: isDarkMode ? '#fff' : '#000' }
//           ]}
//           placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
//         />

//         <TouchableOpacity style={[styles.button, { backgroundColor: '#00a7e1' }]} onPress={saveData}>
//           <Text style={styles.buttonText}>Save</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     padding: 20,
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#00a7e1',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   button: {
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//   },
// });











































import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const API_BASE = 'https://foodapp-1-b6x1.onrender.com';

const home = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Food list state
  const [foods, setFoods] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch foods from backend
  const fetchFoods = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get(`${API_BASE}/api/Rrrr`);
      setFoods(res.data);
    } catch (err) {
      console.log('Fetch Error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Save new food
  const saveData = () => {
    if (!name || !price || !imageUrl) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    axios.post(`${API_BASE}//api/Rrrr`, {
      name,
      price: Number(price),
      imageUrl
    })
    .then(res => {
      Alert.alert('Success', 'Food saved successfully');
      setName('');
      setPrice('');
      setImageUrl('');
      fetchFoods(); // refresh list
    })
    .catch(err => {
      console.log('Save Error:', err);
      Alert.alert('Error', 'Failed to save food');
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}
    >
      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 50,
            paddingVertical: 6,
            paddingHorizontal: 6,
            alignSelf: 'flex-start'
          }}
        >
          <Ionicons name="chevron-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Add New Food</Text>

        {/* Input Form */}
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        />
        <TextInput
          placeholder="Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={[styles.input, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: '#00a7e1' }]} onPress={saveData}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        {/* Render food list */}
        {foods.map((food) => (
          <View key={food._id} style={{ marginTop: 15, padding: 12, borderRadius: 8, backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000', fontWeight: '700', fontSize: 16 }}>{food.name}</Text>
            <Text style={{ color: isDarkMode ? '#aaa' : '#333', marginTop: 4 }}>Price: {food.price}</Text>
            <Image source={{ uri: food.imageUrl }} style={{ width: '100%', height: 120, borderRadius: 8, marginTop: 8 }} />
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#00a7e1', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});