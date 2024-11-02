import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Retrieve token from storage

                if (!token) {
                    Alert.alert('Error', 'No token found. Please log in again.');
                    return; // Exit if no token
                }

                const response = await fetch('http://192.168.9.123:3000/api/check-new-notes', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

            if (!responseNotes.ok || !responseCourses.ok) {
                throw new Error('Failed to fetch data');
            }

            const dataNotes = await responseNotes.json();
            const dataCourses = await responseCourses.json();

            if (dataNotes.success) setNotes(dataNotes.newNotes);
            else setNotes([]);

            if (dataCourses.success) setCourses(dataCourses.newCourses);
            else setCourses([]);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Could not fetch data.');
            Alert.alert('Error', 'Could not fetch data, please try again later.');
        }
    };

    // Function to mark a course as viewed
    const markCourseAsViewed = async (courseId) => {
        try {
            const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
            const response = await fetch(`http://192.168.232.123:4000/api/mark-course-viewed/${courseId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error marking course as viewed: ${response.status}`); // Include status in error message
            }

            const data = await response.json();
            console.log('Update Response Data:', data); // Log response data

            if (!data.success) {
                Alert.alert('Error', data.message || 'Could not mark course as viewed.');
            } else {
                fetchData(); // Reload data after marking course as viewed
            }
        } catch (error) {
            console.error('Error updating course view status:', error);
            Alert.alert('Error', 'Could not update course view status. Please try again later.');
        }
    };

    // Function to mark a note as viewed
    const markNoteAsViewed = async (noteId) => {
        try {
            const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
            const response = await fetch(`http://192.168.9.123:3000/api/mark-note-viewed/${noteId}`, {
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
            } else {
                fetchData(); // Reload data after marking note as viewed
            }
        } catch (error) {
            console.error('Error updating note view status:', error);
            Alert.alert('Error', 'Could not update note view status. Please try again later.');
        }
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() => {
                if (item.type === 'note') {
                    markNoteAsViewed(item.id); // Mark note as viewed when clicked
                    navigation.navigate('MesNotes', { noteId: item.id });
                } else {
                    // Mark the course as viewed when clicked
                    markCourseAsViewed(item.id);
                    navigation.navigate('MesCours', { courseId: item.id });
                }
            }}
        >
            <View style={styles.notification}>
                <Text style={styles.notificationText}>
                    {item.type === 'note'
                        ? `New Note Added: ${item.matiere} - Note: ${item.note}`
                        : `New Course Added: ${item.matiere} - ${item.title}`}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Notifications</Text>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={[...notes.map(note => ({ ...note, type: 'note' })), ...courses.map(course => ({ ...course, type: 'course' }))]}
                    renderItem={renderNotification}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.notificationList}
                />
            )}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    notificationList: { paddingBottom: 20 },
    notificationContainer: { padding: 15, marginBottom: 10 },
    notification: { padding: 15, backgroundColor: '#f0f8ff', borderRadius: 5, elevation: 2 },
    notificationText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});

export default Home;