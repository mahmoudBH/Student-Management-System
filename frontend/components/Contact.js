// components/Contact.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://192.168.228.100:4000/api/contacts'); // Adjust port if needed
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#4a90e2" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Information</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>📧 {item.email}</Text>
            <Text style={styles.mobile}>📞 {item.mobile_number}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#34495e',
    alignSelf: 'center',
    marginBottom: 16,
  },
  contactItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#e6eaf0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c3d5a',
  },
  email: {
    fontSize: 16,
    color: '#4a90e2',
    marginTop: 5,
  },
  mobile: {
    fontSize: 16,
    color: '#4a90e2',
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Contact;
