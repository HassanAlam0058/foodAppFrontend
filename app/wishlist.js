import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const loadWishlist = async () => {
    try {
      const data = await AsyncStorage.getItem('wishlist');
      const parsed = data ? JSON.parse(data) : [];
      const withQty = parsed.map(item => ({ ...item, qty: item.qty ?? 1 }));
      setWishlist(withQty);
    } catch (error) {
      console.log('Load wishlist error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [])
  );

  const increaseQty = (index) => {
    const updated = [...wishlist];
    updated[index].qty += 1;
    setWishlist(updated);
    AsyncStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const decreaseQty = (index) => {
    const updated = [...wishlist];
    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
      setWishlist(updated);
      AsyncStorage.setItem('wishlist', JSON.stringify(updated));
    }
  };

  const removeItem = (index) => {
    const updated = [...wishlist];
    updated.splice(index, 1);
    setWishlist(updated);
    AsyncStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const renderRightActions = (index) => (
    <TouchableOpacity
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        borderRadius: 14,
        marginBottom: 12,
      }}
      onPress={() => removeItem(index)}
    >
      <Ionicons name="trash-outline" size={28} color="#fff" />
    </TouchableOpacity>
  );

  const totalPrice = wishlist.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={isDarkMode ? '#fff' : '#111'}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            styles.headerTitle,
            { color: isDarkMode ? '#fff' : '#111' }
          ]}
        >
          My Wishlist
        </Text>
      </View>

      {wishlist.length === 0 ? (
        <Text
          style={[
            styles.emptyText,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}
        >
          No items in wishlist
        </Text>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <Swipeable
              renderRightActions={() => renderRightActions(index)}
            >
              <TouchableOpacity
                style={[
                  styles.card,
                  { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/about',
                    params: item,
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text
                    style={[
                      styles.name,
                      { color: isDarkMode ? '#fff' : '#111' }
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.price,
                      { color: '#00a7e1' }
                    ]}
                  >
                    ₹{item.price}
                  </Text>

                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      style={styles.qtyBtnOutline}
                      onPress={() => decreaseQty(index)}
                    >
                      <Text style={styles.qtyOutlineText}>−</Text>
                    </TouchableOpacity>

                    <Text
                      style={[
                        styles.qtyNumber,
                        { color: isDarkMode ? '#fff' : '#111' }
                      ]}
                    >
                      {item.qty}
                    </Text>

                    <TouchableOpacity
                      style={styles.qtyBtnFilled}
                      onPress={() => increaseQty(index)}
                    >
                      <Text style={styles.qtyFilledText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}

      <View
        style={[
          styles.totalBar,
          { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
        ]}
      >
        <Text
          style={[
            styles.totalText,
            { color: isDarkMode ? '#fff' : '#111' }
          ]}
        >
          Total
        </Text>
        <Text style={styles.totalAmount}>₹{totalPrice}</Text>
      </View>
    </View>
  );
}

export default Wishlist

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    height: 44,
    justifyContent: 'center',
    marginBottom: 14,
  },
  backButton: {
    padding: 8,
    marginRight: 6,
    marginTop: 12, // added extra top spacing
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerTitle: {
    position: 'absolute',
    alignSelf: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    opacity: 0.7,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  price: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  qtyBtnOutline: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00a7e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyOutlineText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00a7e1',
  },
  qtyBtnFilled: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00a7e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyFilledText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  qtyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  qtyNumber: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00a7e1',
  },
});