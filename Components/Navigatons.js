
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Scr/Login';
import Signup from '../Scr/Signup';
import Home from '../Scr/Home';
import FlightDetailsScreen from '../Scr/FlightDetailsScreen';
import ResultsScreen from '../Scr/ResultsScreen';
import Splash from '../Scr/Splash';



const Stack = createNativeStackNavigator();

function Navscreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FlightDetailsScreen" component={FlightDetailsScreen} />
      <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>

      <Navscreen />


    </NavigationContainer>
  );
}

export default App;
