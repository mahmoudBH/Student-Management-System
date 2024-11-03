import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const MesCours = () => {
    const [cours, setCours] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCours = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.228.100:4000/api/mescours', {
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
        } finally {
            setRefreshing(false); // Arrêter le rafraîchissement une fois les données récupérées
        }
    };

    useEffect(() => {
        fetchCours();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCours(); // Relancer la récupération des cours
    };

    const handleDownload = async (fileUrl) => {
        if (!fileUrl || !/^https?:\/\//.test(fileUrl)) {
            Alert.alert('Error', 'Invalid file URL. Please check the URL and try again.');
            return;
        }

        try {
            const uri = `${FileSystem.documentDirectory}${fileUrl.split('/').pop()}`;
            const download = FileSystem.createDownloadResumable(fileUrl, uri);
            const { uri: localUri } = await download.downloadAsync();
            console.log('Downloaded to:', localUri);
            Alert.alert('Success', 'Course downloaded successfully!', [{ text: 'OK' }]);
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'An error occurred while downloading the course.');
        }
    };

    const renderCourse = ({ item }) => (
        <TouchableOpacity onPress={() => handleDownload(`http://192.168.228.100:4000/${item.pdf_path}`)}>
            <View style={styles.courseItem}>
                <Text style={styles.courseTitle}>{item.matiere}</Text>
                <Text style={styles.courseDescription}>Class: {item.classe}</Text>
                <Text style={styles.courseDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Courses</Text>
            <FlatList
                data={cours}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCourse}
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
        backgroundColor: '#f7f9fc',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e305f',
        alignSelf: 'center',
        marginBottom: 20,
    },
    courseItem: {
        padding: 18,
        marginVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e6ef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e305f',
    },
    courseDescription: {
        fontSize: 16,
        color: '#64748b',
        marginVertical: 4,
    },
    courseDate: {
        fontSize: 14,
        color: '#9aa5b1',
        marginTop: 6,
        fontStyle: 'italic',
    },
});

export default MesCours;
