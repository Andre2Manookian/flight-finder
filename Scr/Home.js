import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { getCitySuggestions } from '../services/api'
import { Calendar } from 'react-native-calendars'


const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}


const Home = () => {
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [fromCityCode, setFromCityCode] = useState(null)
  const [toCityCode, setToCityCode] = useState(null)
  const [departureDate, setDepartureDate] = useState(new Date())
  const [passengers, setPassengers] = useState('1')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [markedDates, setMarkedDates] = useState({})

  const [fromCitySuggestions, setFromCitySuggestions] = useState([])
  const [toCitySuggestions, setToCitySuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)

  const navigation = useNavigation()


  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || departureDate
    setShowDatePicker(false)
    setDepartureDate(currentDate)
  }

  const handleSelectSuggestion = (suggestion, field) => {
    if (field === 'from') {
      setFromCity(suggestion.name)
      setFromCityCode(suggestion.code)
      setFromCitySuggestions([])
    } else {
      setToCity(suggestion.name)
      setToCityCode(suggestion.code)
      setToCitySuggestions([])
    }
    setActiveField(null)
  }

  const renderSuggestionItem = ({ item, field }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item, field)}
    >
      <Text style={styles.suggestionText}>{item.name}</Text>
      {item.country && <Text style={styles.suggestionCountry}>{item.country}</Text>}
    </TouchableOpacity>
  )

  // ----------------- Search -----------------
  const handleSearch = async () => {
    if (!fromCityCode && fromCity.length >= 2) {
      const suggestions = await getCitySuggestions(fromCity)
      if (suggestions.length > 0) setFromCityCode(suggestions[0].code)
    }
    if (!toCityCode && toCity.length >= 2) {
      const suggestions = await getCitySuggestions(toCity)
      if (suggestions.length > 0) setToCityCode(suggestions[0].code)
    }

    if (!fromCityCode) {
      Alert.alert('Error', 'Please choose a departure city from suggestions')
      return
    }
    if (!toCityCode) {
      Alert.alert('Error', 'Please choose a destination city from suggestions')
      return
    }
    if (isNaN(parseInt(passengers)) || parseInt(passengers) < 1) {
      Alert.alert('Error', 'Please enter a valid number of passengers')
      return
    }

    navigation.navigate('ResultsScreen', {
      origin: fromCityCode,
      destination: toCityCode,
      date: formatDate(departureDate),
      passengers: parseInt(passengers, 10),
      originName: fromCity,
      destinationName: toCity
    })
  }

  useEffect(() => {
    if (fromCityCode && toCityCode) {
      const today = new Date()
      const availability = {}
      for (let i = 1; i <= 30; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        const ds = formatDate(d)
        if (Math.random() > 0.3) {
          availability[ds] = { marked: true, dotColor: '#007AFF' }
        }
      }
      availability[formatDate(departureDate)] = {
        ...(availability[formatDate(departureDate)] || {}),
        selected: true,
        selectedColor: '#007AFF'
      }
      setMarkedDates(availability)
    } else {
      setMarkedDates({})
    }
  }, [fromCityCode, toCityCode, departureDate])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>✈️ Flight Finder</Text>
          <Text style={styles.subtitle}>Find your perfect flight</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Search Flights</Text>

          {/* From City */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>From</Text>
            <TextInput
              style={styles.input}
              placeholder="Departure City"
              value={fromCity}
              onChangeText={async (t) => {
                setFromCity(t)
                setFromCityCode(null)
                setActiveField('from')
                if (t.length >= 2) {
                  const suggestions = await getCitySuggestions(t)
                  setFromCitySuggestions(suggestions)
                } else {
                  setFromCitySuggestions([])
                }
              }}
              onFocus={() => setActiveField('from')}
            />
            {activeField === 'from' && fromCitySuggestions.length > 0 && (
              <FlatList
                data={fromCitySuggestions}
                renderItem={({ item }) => renderSuggestionItem({ item, field: 'from' })}
                keyExtractor={(item, index) => `from-${index}`}
                nestedScrollEnabled
                style={styles.suggestionsList}
              />
            )}
          </View>

          {/* To City */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>To</Text>
            <TextInput
              style={styles.input}
              placeholder="Destination City"
              value={toCity}
              onChangeText={async (t) => {
                setToCity(t)
                setToCityCode(null)
                setActiveField('to')
                if (t.length >= 2) {
                  const suggestions = await getCitySuggestions(t)
                  setToCitySuggestions(suggestions)
                } else {
                  setToCitySuggestions([])
                }
              }}
              onFocus={() => setActiveField('to')}
            />
            {activeField === 'to' && toCitySuggestions.length > 0 && (
              <FlatList
                data={toCitySuggestions}
                renderItem={({ item }) => renderSuggestionItem({ item, field: 'to' })}
                keyExtractor={(item, index) => `to-${index}`}
                nestedScrollEnabled
                style={styles.suggestionsList}
              />
            )}
          </View>

          {/* Date Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Departure Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowCalendar((s) => !s)}
            >
              <Text>{formatDate(departureDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={departureDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Calendar */}
          {showCalendar && (
            <View style={styles.calendarContainer}>
              <Text style={styles.calendarTitle}>Available Flight Days</Text>
              <Calendar
                current={formatDate(departureDate)}
                minDate={formatDate(new Date())}
                onDayPress={(day) => {
                  const d = new Date(day.dateString)
                  setDepartureDate(d)
                  setMarkedDates((prev) => ({
                    ...prev,
                    [day.dateString]: {
                      ...(prev[day.dateString] || {}),
                      selected: true,
                      selectedColor: '#007AFF'
                    }
                  }))
                  setShowCalendar(false)
                }}
                markedDates={markedDates}
                markingType={'dot'}
                theme={{
                  selectedDayBackgroundColor: '#007AFF',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#007AFF',
                  dotColor: '#007AFF',
                  arrowColor: '#007AFF',
                }}
              />
            </View>
          )}

          {/* Passengers */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Passengers</Text>
            <TextInput
              style={styles.input}
              placeholder="Number of Passengers"
              value={passengers}
              onChangeText={setPassengers}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search Flights</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  scrollContainer: { paddingBottom: 30 },
  header: { marginBottom: 20 },
  title: {
    fontSize: 24, fontWeight: 'bold', textAlign:
      'center'
  },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666' },
  formContainer: { marginTop: 10 },
  formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  inputContainer: { marginBottom: 15 },
  label: { marginBottom: 5, fontSize: 14, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8
  },
  suggestionsList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5
  },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  suggestionText: { fontSize: 14, fontWeight: '500' },
  suggestionCountry: { fontSize: 12, color: '#666' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  calendarContainer: { marginBottom: 15 },
  calendarTitle: { fontSize: 16, marginBottom: 5, fontWeight: '500' }
})
