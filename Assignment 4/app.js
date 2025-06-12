import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  Platform, StyleSheet, ScrollView
} from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Accelerometer } from 'expo-sensors';

/////////////////////////////////////
// 1. Context API
/////////////////////////////////////
const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [jokes, setJokes] = useState([]);
  const [status, setStatus] = useState('');

  const RAPID_KEY = 'YOUR_RAPIDAPI_KEY_HERE';
  const BASE = 'https://jokeapi-v2.p.rapidapi.com';

  const fetchJokes = async () => {
    setStatus('Fetching...');
    try {
      const res = await fetch(`${BASE}/joke/Any?type=twopart&amount=3`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPID_KEY,
          'X-RapidAPI-Host': 'jokeapi-v2.p.rapidapi.com',
        },
      });
      const json = await res.json();
      setJokes(json.jokes || []);
      setStatus('Fetched successfully.');
    } catch (e) {
      console.error(e);
      setStatus('Error fetching jokes');
    }
  };

  const addJoke = async (setup, delivery) => {
    setStatus('Submitting joke...');
    try {
      console.log('POST joke:', { setup, delivery });
      setStatus('Joke submitted (simulated)');
    } catch (e) {
      console.error(e);
      setStatus('Failed to submit joke');
    }
  };

  const updateJoke = async (id, newDelivery) => {
    setStatus('Updating joke...');
    try {
      console.log('PUT joke:', { id, newDelivery });
      setStatus('Joke updated (simulated)');
    } catch (e) {
      console.error(e);
      setStatus('Failed to update joke');
    }
  };

  return (
    <ApiContext.Provider value={{ jokes, fetchJokes, addJoke, updateJoke, status }}>
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => useContext(ApiContext);

/////////////////////////////////////
// 2. Screens
/////////////////////////////////////
function HomeScreen({ navigation }) {
  const { jokes, fetchJokes, status } = useApi();

  useEffect(() => {
    fetchJokes();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>😂 Fetched Jokes</Text>
      <FlatList
        data={jokes}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.setup}</Text>
            <Text style={styles.cardText}>{item.delivery}</Text>
          </View>
        )}
      />
      <Text style={styles.status}>Status: {status}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Form')}>
        <Text style={styles.buttonText}>➕ Add Joke</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('Sensor')}>
        <Text style={styles.buttonTextOutline}>📱 View Sensor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function JokeFormScreen() {
  const { addJoke, updateJoke, status } = useApi();
  const [setup, setSetup] = useState('');
  const [delivery, setDelivery] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✍️ Submit a New Joke</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter setup"
        value={setup}
        onChangeText={setSetup}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter delivery"
        value={delivery}
        onChangeText={setDelivery}
      />

      <TouchableOpacity style={styles.button} onPress={() => addJoke(setup, delivery)}>
        <Text style={styles.buttonText}>Submit Joke (POST)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={() => updateJoke(1, delivery)}>
        <Text style={styles.buttonTextOutline}>Update Joke (PUT)</Text>
      </TouchableOpacity>

      <Text style={styles.status}>Status: {status}</Text>
    </View>
  );
}

function SensorScreen() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);

  const subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelData => {
        setData(accelData);
      })
    );
    Accelerometer.setUpdateInterval(300);
  };

  const unsubscribe = () => {
    subscription?.remove();
    setSubscription(null);
  };

  useEffect(() => {
    if (Platform.OS !== 'web') subscribe();
    return () => unsubscribe();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text>Sensors not supported on web. Try on a real device.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 Accelerometer</Text>
      <Text>X: {data.x.toFixed(3)}</Text>
      <Text>Y: {data.y.toFixed(3)}</Text>
      <Text>Z: {data.z.toFixed(3)}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={subscription ? unsubscribe : subscribe}
      >
        <Text style={styles.buttonText}>{subscription ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}

/////////////////////////////////////
// 3. Navigation Setup
/////////////////////////////////////
const Stack = createStackNavigator();

export default function App() {
  return (
    <ApiProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Form" component={JokeFormScreen} />
          <Stack.Screen name="Sensor" component={SensorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApiProvider>
  );
}

/////////////////////////////////////
// 4. Styles
/////////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  status: {
    marginVertical: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fafafa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 2 },
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonOutline: {
    borderColor: '#007AFF',
    borderWidth: 1.5,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonTextOutline: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
