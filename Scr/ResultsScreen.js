// ResultsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const API_KEY = "a573e70924msh8abdea7c4475226p1cefbfjsn24377d886104";

export default function ResultsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { origin, destination, date, passengers = 1, originName, destinationName } = route.params;
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await searchFlights(origin, destination, date, passengers);

        if (data && data.data) {
          setFlights(data.data.flights || []);
        } else {
          setError('No flights data received');
        }
      } catch (err) {
        console.log('Flights error:', err?.response?.data || err.message);
        setError('Failed to fetch flights. Please try again later.');
        Alert.alert('Error', 'Failed to fetch flights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, date, passengers]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Searching for flights...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorDetail}>Check your API key or try again later.</Text>
      </View>
    );
  }

  if (flights.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noFlightsText}>No flights found for your search criteria.</Text>
        <Text style={styles.tryAgain}>Try different airports or dates.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Flights from {originName || origin} to {destinationName || destination}</Text>
      <Text style={styles.date}>{date}</Text>

      <FlatList
        data={flights}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('FlightDetailsScreen', { flight: item })}
          >
            <Text style={styles.airline}>
              {item.legs?.[0]?.carriers?.marketing?.[0]?.name || 'Unknown Airline'}
            </Text>
            <Text style={styles.route}>
              {item.legs?.[0]?.origin?.id} → {item.legs?.[0]?.destination?.id}
            </Text>
            <Text>Departure: {item.legs?.[0]?.departure ? new Date(item.legs[0].departure).toLocaleString() : 'N/A'}</Text>
            <Text>Arrival: {item.legs?.[0]?.arrival ? new Date(item.legs[0].arrival).toLocaleString() : 'N/A'}</Text>
            <Text style={styles.price}>
              Price: {item.price?.formatted || 'N/A'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  date: { fontSize: 16, marginBottom: 5, textAlign: 'center', color: '#666' },
  resultsCount: { fontSize: 14, marginBottom: 20, textAlign: 'center', color: '#888' },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 10 },
  errorDetail: { color: '#666', fontSize: 14, textAlign: 'center' },
  noFlightsText: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  tryAgain: { fontSize: 14, textAlign: 'center', color: '#666' },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9'
  },
  airline: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  route: { fontSize: 14, marginBottom: 5, color: '#333' },
  price: { fontWeight: 'bold', fontSize: 16, color: '#007AFF', marginTop: 5 }
});