import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found in storage.');
        }
    
        const response = await fetch('http://192.168.158.100:5000/api/session', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          },
        });
    
        const data = await response.json();
        console.log('Server response:', data);
    
        if (response.ok && data.loggedIn) {
          setUser(data.user);
        } else {
          throw new Error(data.message || 'No user logged in.');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        Alert.alert('Erreur', error.message || 'Session invalide ou expirée. Veuillez vous reconnecter.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.welcomeText}>
          Welcome, {user.firstname} {user.lastname}!
        </Text>
      ) : (
        <Text style={styles.welcomeText}>Not logged in.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'royalblue',
  },
});

export default Home;
