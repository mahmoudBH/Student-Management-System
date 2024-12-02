import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const MesNotes = () => {
    const [notes, setNotes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotes = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.205.100:4000/api/mesnotes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotes(data);
                
                // Afficher une notification lorsque les notes sont récupérées
                PushNotification.localNotification({
                    title: "Notes mises à jour",
                    message: `Vous avez ${data.length} notes disponibles.`,
                    priority: "high",
                    smallIcon: "ic_notification",
                });

            } else {
                console.log('Error fetching notes:', response.status);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotes().then(() => setRefreshing(false));
    };

    const renderNote = ({ item }) => (
        <View style={styles.noteItem}>
            <View style={styles.noteContent}>
                <Text style={styles.noteTitle}>📘 {item.matiere}</Text>
                <Text style={styles.noteClass}>Class: {item.class}</Text>
            </View>
            <View style={[styles.gradeBadge, getGradeStyle(item.note)]}>
                <Text style={styles.gradeText}>{item.note}</Text>
            </View>
        </View>
    );

    const getGradeStyle = (grade) => {
        if (grade >= 16) return { backgroundColor: '#4CAF50' }; // Green for good grades (16-20)
        if (grade >= 11) return { backgroundColor: '#FFEB3B' }; // Yellow for average grades (11-15)
        if (grade >= 6) return { backgroundColor: '#FF9800' }; // Orange for passable grades (6-10)
        return { backgroundColor: '#F44336' }; // Red for low grades (0-5)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Grades</Text>
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderNote}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f6fa',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 20,
        alignSelf: 'center',
    },
    noteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    noteContent: {
        flex: 1,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    noteClass: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
    gradeBadge: {
        minWidth: 50,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default MesNotes;
