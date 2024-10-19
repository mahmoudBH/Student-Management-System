// Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('http://192.168.1.164:5000/api/session', {
          method: 'GET',
          credentials: 'include', // Important for session management
        });
        const data = await response.json();
        if (data.loggedIn) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
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
        <Text style={styles.welcomeText}>Welcome, {user.firstname} {user.lastname}!</Text>
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
