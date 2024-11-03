import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false); // State for refresh control
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // Fetch data when the component mounts or when the screen refocuses
    const fetchData = async () => {
        try {
            setRefreshing(true); // Start refreshing
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No token found. Please log in again.');
                return;
            }

            const classId = await AsyncStorage.getItem('class');
            const responseNotes = await fetch('http://192.168.228.100:4000/api/check-new-notes', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const responseCourses = await fetch(`http://192.168.228.100:4000/api/check-new-courses?classId=${classId}`, {
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
        } finally {
            setRefreshing(false); // Stop refreshing
        }
    };

    useEffect(() => {
        if (isFocused) fetchData(); // Fetch data when focused
    }, [isFocused]);

    const onRefresh = () => {
        fetchData(); // Fetch data on pull-to-refresh
    };

    const markCourseAsViewed = async (courseId) => {
        // Your existing function...
    };

    const markNoteAsViewed = async (noteId) => {
        // Your existing function...
    };

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() => {
                if (item.type === 'note') {
                    markNoteAsViewed(item.id);
                    navigation.navigate('MesNotes', { noteId: item.id });
                } else {
                    markCourseAsViewed(item.id);
                    navigation.navigate('MesCours', { courseId: item.id });
                }
            }}
        >
            <View style={styles.notification}>
                <Text style={styles.notificationText}>
                    {item.type === 'note'
                        ? `📌 New Note: ${item.matiere} - Score: ${item.note}`
                        : `📚 New Course: ${item.matiere} - ${item.title}`}
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
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#6200ee']} // Custom color for the refresh control
                            progressBackgroundColor="#f7f9fc" // Background color for the refresh control
                            tintColor="#6200ee" // Color of the spinner
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f7f9fc' },
    title: { fontSize: 26, fontWeight: '600', color: '#333', marginBottom: 10, textAlign: 'center' },
    notificationList: { paddingBottom: 20 },
    notificationContainer: { padding: 12, marginVertical: 5, borderRadius: 8, backgroundColor: '#e3f2fd', borderWidth: 1, borderColor: '#90caf9' },
    notification: { padding: 15, backgroundColor: '#bbdefb', borderRadius: 5, elevation: 2 },
    notificationText: { fontSize: 16, fontWeight: '500', color: '#0d47a1' },
    errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});

export default Home;
