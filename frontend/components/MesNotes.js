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