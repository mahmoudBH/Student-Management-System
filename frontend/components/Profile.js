import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);

    const fetchData = async () => {
        setRefreshing(true); // Démarrer le rafraîchissement
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.228.100:4000/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const jsonResponse = await response.json();
            if (jsonResponse.success) {
                setUserData(jsonResponse.data);
                setFirstname(jsonResponse.data.firstname);
                setLastname(jsonResponse.data.lastname);
                setEmail(jsonResponse.data.email);
            } else {
                console.error('Erreur lors de la récupération des données:', jsonResponse.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
            setRefreshing(false); // Arrêter le rafraîchissement
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdate = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.228.100:4000/api/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstname, lastname, email }),
        });

        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            Alert.alert('Success', 'Profile updated successfully!');
            fetchData(); // Rafraîchir les données après mise à jour
        } else {
            Alert.alert('Error', jsonResponse.message);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }

        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.228.100:4000/api/change-password', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            Alert.alert('Success', 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            fetchData(); // Rafraîchir les données après changement de mot de passe
        } else {
            Alert.alert('Error', jsonResponse.message);
        }
    };

    const handlePhotoSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'You need to enable permissions to access the photo library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePhoto(result.assets[0].uri);
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();
            formData.append('profile_photo', {
                uri: result.assets[0].uri,
                name: 'profile_photo.jpg',
                type: 'image/jpeg',
            });

            const uploadResponse = await fetch('http://192.168.228.100:4000/api/upload-photo', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const uploadJsonResponse = await uploadResponse.json();
            if (uploadJsonResponse.success) {
                Alert.alert('Success', 'Profile photo updated successfully!');
                fetchData(); // Rafraîchir les données après mise à jour de la photo
            } else {
                Alert.alert('Error', uploadJsonResponse.message);
            }
        }
    };

    if (loading) {
        return <Text style={styles.loadingText}>Chargement...</Text>;
    }

    if (!userData) {
        return <Text style={styles.loadingText}>Aucune donnée à afficher.</Text>;
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchData}
                />
            }
        >
            <Text style={styles.title}>Profile</Text>
            <View style={styles.photoContainer}>
                <Image
                    source={{ uri: profilePhoto || userData.profile_photo }}
                    style={styles.profilePhoto}
                />
                <TouchableOpacity style={styles.photoButton} onPress={handlePhotoSelect}>
                    <Text style={styles.photoButtonText}>Select Photo</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.editSection}>
                <Text style={styles.sectionTitle}>Edit Profile</Text>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstname}
                    onChangeText={setFirstname}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastname}
                    onChangeText={setLastname}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TouchableOpacity style={styles.primaryButton} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.passwordSection}>
                <Text style={styles.sectionTitle}>Change Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.primaryButton} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
        marginTop: 20,
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 2,
        backgroundColor: '#fff',
    },
    editSection: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    passwordSection: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#f1f1f1',
        fontSize: 16,
    },
    photoButton: {
        backgroundColor: '#6c757d', // Couleur du bouton pour sélectionner la photo
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButton: {
        backgroundColor: '#007bff', // Couleur bleu pour le bouton principal
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    photoButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;
