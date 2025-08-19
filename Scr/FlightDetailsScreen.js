// FlightDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function FlightDetailsScreen() {
  const route = useRoute();
  const { flight } = route.params;
  const leg = flight?.legs?.[0];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Flight Details</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Airline</Text>
        <Text style={styles.info}>{leg?.carriers?.marketing?.[0]?.name || 'Unknown Airline'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Route</Text>
        <Text style={styles.info}>
          {leg?.origin?.name} ({leg?.origin?.id}) → {leg?.destination?.name} ({leg?.destination?.id})
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <Text>Departure: {leg?.departure ? new Date(leg.departure).toLocaleString() : 'N/A'}</Text>
        <Text>Arrival: {leg?.arrival ? new Date(leg.arrival).toLocaleString() : 'N/A'}</Text>
        <Text>Duration: {leg?.durationInMinutes != null ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flight Information</Text>
        <Text>Stops: {leg?.stopCount ?? 'N/A'}</Text>
        <Text>Flight Number: {leg?.carriers?.marketing?.[0]?.alternateId || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price</Text>
        <Text style={styles.price}>{flight?.price?.formatted || 'N/A'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  info: { fontSize: 16, marginBottom: 5 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' }
});