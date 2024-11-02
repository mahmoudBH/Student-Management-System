import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState('');
    const navigation = useNavigation(); // Hook for navigation

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Retrieve token from storage

                if (!token) {
                    Alert.alert('Error', 'No token found. Please log in again.');
                    return; // Exit if no token
                }

                const response = await fetch('http://192.168.43.100:3000/api/check-new-notes', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Response Status:', response.status); // Log status code

                const data = await response.json();
                console.log('Response Data:', data); // Log response data

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`); // Include status in error message
                }

                if (data.success) {
                    setNotes(data.newNotes);
                } else {
                    setNotes([]);
                }
            } catch (error) {
                console.error('Error fetching new notes:', error);
                setError('Could not fetch notes.'); // General error message
                Alert.alert('Error', 'Could not fetch notes, please try again later.');
            }
        };

        fetchNotes();
    }, []);

    // Function to mark a note as viewed
    const markNoteAsViewed = async (noteId) => {
        try {
            const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
            const response = await fetch(`http://192.168.43.100:3000/api/mark-note-viewed/${noteId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error marking note as viewed: ${response.status}`); // Include status in error message
            }

            const data = await response.json();
            console.log('Update Response Data:', data); // Log response data

            if (!data.success) {
                Alert.alert('Error', data.message || 'Could not mark note as viewed.');
            }
        } catch (error) {
            console.error('Error updating note view status:', error);
            Alert.alert('Error', 'Could not update note view status. Please try again later.');
        }
    };

    // Function to render each note as a notification
    const renderNote = ({ item }) => (
        <TouchableOpacity 
            style={styles.noteContainer} 
            onPress={() => {
                // Mark the note as viewed
                markNoteAsViewed(item.id);
                
                // Remove the clicked note from the state
                setNotes((prevNotes) => prevNotes.filter(note => note.id !== item.id));

                // Navigate to MesNotes with the note ID
                navigation.navigate('MesNotes', { noteId: item.id });
            }}
        >
            <View style={styles.notification}>
                <Text style={styles.notificationText}>
                    New Note Added: {item.matiere} - Note: {item.note}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Notes</Text>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={notes}
                    renderItem={renderNote}
                    keyExtractor={(item) => item.id.toString()} // Ensure the key is unique
                    contentContainerStyle={styles.notesList}
                />
            )}
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    notesList: {
        paddingBottom: 20,
    },
    noteContainer: {
        padding: 15,
        marginBottom: 10,
    },
    notification: {
        padding: 15,
        backgroundColor: '#f0f8ff', // Light blue background for notification
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 2,
    },
    notificationText: {
        fontSize: 16,
        fontWeight: 'bold', // Bold text for better visibility
        color: '#333', // Dark text color
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Home;