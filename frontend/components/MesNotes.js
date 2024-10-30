<<<<<<< HEAD
// components/MesNotes.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const MesNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get the token from AsyncStorage
        
        if (!token) {
          throw new Error('No token found. Please log in again.');
        }

        const response = await fetch('http://192.168.1.135:3000/api/notes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
          credentials: 'include', // Ensure cookies are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        } else {
          console.error('Error fetching notes:', response.statusText);
          Alert.alert('Error', response.statusText); // Show error alert
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        Alert.alert('Error', error.message); // Show error alert
      } finally {
        setLoading(false); // Stop loading after fetching notes
      }
    };

    fetchNotes();
  }, []);

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <Text style={styles.nameText}>{item.firstname} {item.lastname}</Text>
      <Text style={styles.detailText}>Class: {item.class}</Text>
      <Text style={styles.detailText}>Matière: {item.matiere}</Text>
      <Text style={styles.noteText}>Note: {item.note}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Notes</Text>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#333', marginVertical: 20, textAlign: 'center' },
  listContainer: { paddingBottom: 20 },

  noteItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  nameText: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 5 },
  detailText: { fontSize: 16, color: '#555', marginBottom: 2 },
  noteText: { fontSize: 18, fontWeight: '600', color: '#6200ea', marginTop: 10, textAlign: 'right' },
});

export default MesNotes;
=======
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MesNotes = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Retrieve token from storage

                const response = await fetch('http://192.168.90.123:3000/api/mesnotes', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotes(data); // Set notes data
                } else {
                    console.log('Error fetching notes:', response.status);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchNotes();
    }, []);

    const renderNote = ({ item }) => (
        <View style={styles.noteItem}>
            <Text style={styles.noteTitle}>Matière: {item.matiere}</Text>
            <Text style={styles.noteContent}>Classe: {item.class}</Text>
            <Text style={styles.noteContent}>Note: {item.note}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mes Notes</Text>
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderNote}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    noteItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    noteContent: {
        fontSize: 16,
        color: '#555',
    },
});

export default MesNotes;
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
