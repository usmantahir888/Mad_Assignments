// App.js
import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeScreen() {
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log('Location:', location);

        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        console.log('Reverse Geocode:', geocode);

        if (geocode.length > 0) {
          const place = geocode[0];
          const detectedCity = place.city || place.region || place.subregion || 'Unknown';
          setCity(detectedCity);
        } else {
          setCity('Could not find city');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setErrorMsg('Location error: ' + error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : errorMsg ? (
        <Text style={styles.text}>{errorMsg}</Text>
      ) : (
        <Text style={styles.text}>Your City: {city}</Text>
      )}
    </View>
  );
}


function ProfileScreen({ navigation, route }) {
  const [name, setName] = useState('Taskeen');

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit your name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Coming Soon</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  }
});