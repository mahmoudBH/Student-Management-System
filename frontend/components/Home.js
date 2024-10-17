// Home.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = ({ route }) => {
  const { firstname, lastname } = route.params || {}; // Assurez-vous d'extraire les valeurs des paramètres

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {firstname} {lastname}!</Text>
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
