import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({ setIsLoggedIn }) => {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.43.100:3000/api/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies for session logout
      });

      if (!response.ok) {
        throw new Error('Failed to log out.');
      }

      const data = await response.json();

      if (data.success) {
        // Remove token from AsyncStorage
        await AsyncStorage.removeItem('token');
        Alert.alert('Succès', 'Déconnexion réussie!');
        setIsLoggedIn(false); // Update login state to false
      } else {
        Alert.alert('Erreur', data.message);
      }
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
      console.error('Logout Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
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
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'royalblue',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Logout;