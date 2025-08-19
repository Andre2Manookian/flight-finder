import React, { useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, StatusBar, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Splash = () => {
  const navigation = useNavigation();
  const planeAnim = useRef(new Animated.Value(-100)).current; // start off screen

  useEffect(() => {
    // Animate airplane across the screen
    Animated.loop(
      Animated.timing(planeAnim, {
        toValue: width,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    // Navigate to login after 5 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }]
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#87CEEB" barStyle="light-content" />
      <View style={styles.sky}>
        <Text style={styles.title}>Flight Ticket Finder</Text>

        {/* Moving airplane */}
        <Animated.View style={[styles.plane, { transform: [{ translateX: planeAnim }] }]}>
          <Text style={{ fontSize: 40 }}>✈️</Text>
        </Animated.View>

        {/* Clouds */}
        <View style={[styles.cloud, { top: 50, left: 30 }]}><Text>☁️</Text></View>
        <View style={[styles.cloud, { top: 100, left: 150 }]}><Text>☁️</Text></View>
        <View style={[styles.cloud, { top: 150, left: 80 }]}><Text>☁️</Text></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#87CEEB" },
  sky: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "bold", color: "#fff", marginBottom: 50 },
  plane: { position: "absolute", top: 200 },
  cloud: { position: "absolute" }
});

export default Splash;
