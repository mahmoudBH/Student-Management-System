import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.9.123:3000/api/profile', {
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
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.232.123:4000/api/profile', {
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
        const response = await fetch('http://192.168.232.123:4000/api/change-password', {
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

            const uploadResponse = await fetch('http://192.168.232.123:4000/api/upload-photo', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const uploadJsonResponse = await uploadResponse.json();
            if (uploadJsonResponse.success) {
                Alert.alert('Success', 'Profile photo updated successfully!');
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.photoContainer}>
                <Image
                    source={{ uri: profilePhoto || userData.profile_photo }}
                    style={styles.profilePhoto}
                />
                <TouchableOpacity style={styles.button} onPress={handlePhotoSelect}>
                    <Text style={styles.buttonText}>Select Photo</Text>
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
                />
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
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
                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
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
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    editSection: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    passwordSection: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E90FF',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%', // Set the button width to 100%
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E90FF',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;