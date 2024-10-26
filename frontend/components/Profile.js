import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ setIsLoggedIn }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch('http://172.16.27.219:3000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the header
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setIsLoggedIn(false); // Handle unauthorized access
                    }
                    throw new Error('Profile not found.');
                }

                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error('Profile Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [setIsLoggedIn]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (!profile) {
        return <Text>No profile data available.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.detail}>Firstname: {profile.firstname}</Text>
            <Text style={styles.detail}>Lastname: {profile.lastname}</Text>
            <Text style={styles.detail}>Email: {profile.email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 18,
        marginVertical: 5,
    },
});

export default Profile;
