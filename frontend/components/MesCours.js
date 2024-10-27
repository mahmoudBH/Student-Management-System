// MesCours.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MesCours = () => {
    const [cours, setCours] = useState([]);

    useEffect(() => {
        const fetchCours = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                const response = await fetch('http://192.168.145.123:3000/api/mescours', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCours(data);
                } else {
                    console.log('Error fetching courses:', response.status);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchCours();
    }, []);

    const renderCourse = ({ item }) => (
        <View style={styles.courseItem}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mes Cours</Text>
            <FlatList
                data={cours}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCourse}
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
    courseItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    courseDescription: {
        fontSize: 16,
        color: '#555',
    },
});

export default MesCours;
