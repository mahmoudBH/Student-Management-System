import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const MesCours = () => {
    const [cours, setCours] = useState([]);

    useEffect(() => {
        const fetchCours = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch('http://192.168.90.123:3000/api/mescours', {
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

    const handleDownload = async (fileUrl) => {
        // Vérifiez si l'URL est définie et commence par http ou https
        if (!fileUrl || !/^https?:\/\//.test(fileUrl)) {
            Alert.alert('Error', 'Invalid file URL. Please check the URL and try again.');
            return;
        }

        try {
            const uri = `${FileSystem.documentDirectory}${fileUrl.split('/').pop()}`; // Création du chemin local pour le fichier
            const download = FileSystem.createDownloadResumable(fileUrl, uri);
            const { uri: localUri } = await download.downloadAsync(); // Lancement du téléchargement
            console.log('Downloaded to:', localUri);
            Alert.alert('Success', 'Course downloaded successfully!', [{ text: 'OK' }]);
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'An error occurred while downloading the course.');
        }
    };

    const renderCourse = ({ item }) => (
        <TouchableOpacity onPress={() => handleDownload(`http://192.168.90.123:3000/${item.pdf_path}`)}>
            <View style={styles.courseItem}>
                <Text style={styles.courseTitle}>{item.matiere}</Text>
                <Text style={styles.courseDescription}>{item.classe}</Text>
                <Text style={styles.courseDescription}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
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
