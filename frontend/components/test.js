import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    
    // Password change states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch('http://192.168.43.100:3000/api/profile', {
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
                    setError(jsonResponse.message);
                }
            } catch (error) {
                setError('Erreur de chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.43.100:3000/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, email }),
            });

            const jsonResponse = await response.json();
            if (jsonResponse.success) {
                Alert.alert('Succès', jsonResponse.message);
                setUserData({ ...userData, firstname, lastname, email });
            } else {
                Alert.alert('Erreur', jsonResponse.message);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du profil.');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.43.100:3000/api/change-password', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const jsonResponse = await response.json();
            if (jsonResponse.success) {
                Alert.alert('Succès', jsonResponse.message);
                // Optionally reset password fields
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                Alert.alert('Erreur', jsonResponse.message);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du mot de passe.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!userData) {
        return <Text>Aucune donnée à afficher.</Text>;
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: userData.profile_photo }}
                style={styles.profilePhoto}
            />
            <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={firstname}
                onChangeText={setFirstname}
            />
            <TextInput
                style={styles.input}
                placeholder="Nom"
                value={lastname}
                onChangeText={setLastname}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button title="Mettre à jour" onPress={handleUpdate} />
            
            <Text style={styles.header}>Changer le mot de passe</Text>
            <TextInput
                style={styles.input}
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <Button title="Changer le mot de passe" onPress={handleChangePassword} />
            <Text style={styles.text}>Prénom: {firstname}</Text>
            <Text style={styles.text}>Nom: {lastname}</Text>
            <Text style={styles.text}>Email: {email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default Profile;
