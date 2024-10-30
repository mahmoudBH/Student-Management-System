import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker

const Profile = ({ setIsLoggedIn }) => {
    const [profile, setProfile] = useState({ firstname: '', lastname: '', email: '', password: '', profileImage: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch('http://192.168.1.135:3000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setIsLoggedIn(false);
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

    const updateProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch('http://192.168.137.123:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('Succès', 'Profil mis à jour avec succès');
                setIsEditing(false); // Désactiver l'édition après succès
            } else {
                Alert.alert('Erreur', data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            Alert.alert('Erreur', 'Erreur lors de la mise à jour du profil');
        }
    };

    const selectProfileImage = () => {
        launchImageLibrary({}, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const uri = response.assets[0].uri;
                setProfile({ ...profile, profileImage: uri });
            }
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={selectProfileImage}>
                    {profile.profileImage ? (
                        <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
                    ) : (
                        <Icon name="account-circle" size={80} color="#4CAF50" />
                    )}
                </TouchableOpacity>
                <Text style={styles.title}>
                    {isEditing ? 'Edit Profile' : `${profile.firstname} ${profile.lastname}`}
                </Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Firstname:</Text>
                <TextInput
                    style={styles.input}
                    value={profile.firstname}
                    editable={isEditing}
                    onChangeText={(text) => setProfile({ ...profile, firstname: text })}
                />
                <Text style={styles.label}>Lastname:</Text>
                <TextInput
                    style={styles.input}
                    value={profile.lastname}
                    editable={isEditing}
                    onChangeText={(text) => setProfile({ ...profile, lastname: text })}
                />
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={profile.email}
                    editable={isEditing}
                    onChangeText={(text) => setProfile({ ...profile, email: text })}
                />
                <Text style={styles.label}>Password (optional):</Text>
                <TextInput
                    style={styles.input}
                    value={profile.password}
                    editable={isEditing}
                    onChangeText={(text) => setProfile({ ...profile, password: text })}
                    secureTextEntry
                    placeholder="Enter new password"
                />
            </View>
            {isEditing ? (
                <Button title="Save Changes" onPress={updateProfile} />
            ) : (
                <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 15,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    detailsContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#4CAF50',
    },
});

export default Profile;
