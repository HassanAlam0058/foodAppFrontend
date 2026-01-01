import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const about = () => {
  const { title, description, price, image } = useLocalSearchParams()
  const router = useRouter()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { isDarkMode } = useTheme();

  const toggleWishlist = async () => {
    const item = { title, description, price, image };

    try {
      const existing = await AsyncStorage.getItem('wishlist');
      let wishlist = existing ? JSON.parse(existing) : [];

      const index = wishlist.findIndex(i => i.title === title);

      if (index === -1) {
        // Add to wishlist
        wishlist.push(item);
        setIsWishlisted(true);
      } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        setIsWishlisted(false);
      }

      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.log('Wishlist toggle error:', error);
    }
  };

  const goToWishlist = () => {
    router.push('/wishlist');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#f5f5f5" }]}>
        {/* <Text>this is About page </Text> */}
      <View style={styles.topRow}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.wishlistButton,
            { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
          ]}
          onPress={toggleWishlist}
          onLongPress={goToWishlist}
          delayLongPress={400}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={26}
            color={isWishlisted ? "red" : isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.heroBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.heroImage} />
        ) : null}

        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{title}</Text>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: isDarkMode ? "#1e1e1e" : "#fff" }]}>
        <Text style={[styles.infoLabel, { color: isDarkMode ? "#4db8ff" : "#00a7e1" }]}>Description</Text>
        <Text style={[styles.infoValue, { color: isDarkMode ? "#eee" : "#333" }]}>{description}</Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: isDarkMode ? "#1e1e1e" : "#fff" }]}>
        <Text style={[styles.infoLabel, { color: isDarkMode ? "#4db8ff" : "#00a7e1" }]}>Price</Text>
        <Text style={[styles.infoValue, { color: isDarkMode ? "#eee" : "#333" }]}>₹ {price}</Text>
      </View>

      {/* <View style={{ marginTop: 20, marginBottom: 30, alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#00a7e1',
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5
          }}
          onPress={() => router.push('/home')}
        >
          <Ionicons name="home-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Go to Home</Text>
        </TouchableOpacity>
      </View> */}

    </ScrollView>
  )
}

export default about

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heroBox: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    position: 'relative',
    backgroundColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 18,
    backgroundColor: 'rgba(0,0,0,0.45)'
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff'
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#00a7e1'
  },
  infoValue: {
    fontSize: 17,
    color: '#333'
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 30
  },
  wishlistButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 30
  },
})