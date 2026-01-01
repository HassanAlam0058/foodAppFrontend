import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const About = ({ route }) => {
  const { id } = route.params
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`http://172.20.10.4:8090/api/foods/${id}`)
        setFood(response.data)
      } catch (err) {
        setError('Failed to load food item.')
      } finally {
        setLoading(false)
      }
    }
    fetchFood()
  }, [id])

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <Text style={styles.name}>{food.name}</Text>
      <Text style={styles.price}>${food.price.toFixed(2)}</Text>
      <Text style={styles.description}>{food.description}</Text>
    </ScrollView>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#888',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})