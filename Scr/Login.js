import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Components/firebase'


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();


  const handleSignin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }], // clears stack, only Home remains
        });
      })
      .catch((error) => {
        Alert.alert("Something went wrong. Please check your Email and Password.");
        console.log(error.code, error.message);
      });
  };






  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>✈️ Flight Finder</Text>
        <Text style={styles.subtitle}>Find your perfect flight</Text>
      </View>

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text style={styles.loginText}>Login</Text>
      </View>


      <View style={styles.inputContainer}>
        <TextInput autoCapitalize='none' value={email} onChangeText={setEmail} style={styles.input} placeholder='Email' placeholderTextColor="#999" />
        <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder='Password' placeholderTextColor="#999" secureTextEntry />
      </View>


      <TouchableOpacity onPress={handleSignin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>


      <View style={styles.footer}>
        <Text style={{ color: '#555' }}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  loginText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
  },
  inputContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
})
