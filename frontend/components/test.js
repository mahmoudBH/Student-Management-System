import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

const SignupForm = ({ navigation }) => {
    const pulseAnim = new Animated.Value(1);

    Animated.loop(
        Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.8, duration: 1000, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
    ).start();

    const [focusedInput, setFocusedInput] = useState({});
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async () => {
        // Vérification des champs requis
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
    
        // Vérification que les mots de passe correspondent
        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
    
        try {
            const response = await fetch('http://192.168.1.63:5000/api/signup', { // Remplacez par l'URL de votre serveur
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Envoi des données du formulaire vers le serveur
            });
    
            const result = await response.json();
            if (response.ok) {
                // Affiche un message de succès et redirige vers la page de connexion
                Alert.alert('Success', 'User registered successfully');
                navigation.navigate('Login');
            } else {
                // Affiche le message d'erreur renvoyé par le serveur
                Alert.alert('Error', result.message || 'Registration failed');
            }
        } catch (error) {
            // Gestion des erreurs réseau
            Alert.alert('Error', 'Failed to register. Please try again later.');
        }
    };
    

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.form}>
                    <View style={styles.titleContainer}>
                        <View style={styles.dot} />
                        <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
                        <Text style={styles.title}>Register</Text>
                    </View>
                    <Text style={styles.message}>Signup now and get full access to our app.</Text>

                    <View style={styles.flex}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                onFocus={() => setFocusedInput({ firstname: true })}
                                onBlur={() => setFocusedInput({ firstname: false })}
                                value={formData.firstname}
                                onChangeText={text => setFormData({ ...formData, firstname: text })}
                            />
                            <Text style={[
                                styles.label, 
                                focusedInput.firstname ? styles.labelFocused : {}
                            ]}>
                                Firstname
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                onFocus={() => setFocusedInput({ lastname: true })}
                                onBlur={() => setFocusedInput({ lastname: false })}
                                value={formData.lastname}
                                onChangeText={text => setFormData({ ...formData, lastname: text })}
                            />
                            <Text style={[
                                styles.label, 
                                focusedInput.lastname ? styles.labelFocused : {}
                            ]}>
                                Lastname
                            </Text>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            keyboardType="email-address"
                            onFocus={() => setFocusedInput({ email: true })}
                            onBlur={() => setFocusedInput({ email: false })}
                            value={formData.email}
                            onChangeText={text => setFormData({ ...formData, email: text })}
                        />
                        <Text style={[
                            styles.label, 
                            focusedInput.email ? styles.labelFocused : {}
                        ]}>
                            Email
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            onFocus={() => setFocusedInput({ password: true })}
                            onBlur={() => setFocusedInput({ password: false })}
                            value={formData.password}
                            onChangeText={text => setFormData({ ...formData, password: text })}
                        />
                        <Text style={[
                            styles.label, 
                            focusedInput.password ? styles.labelFocused : {}
                        ]}>
                            Password
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            onFocus={() => setFocusedInput({ confirmPassword: true })}
                            onBlur={() => setFocusedInput({ confirmPassword: false })}
                            value={formData.confirmPassword}
                            onChangeText={text => setFormData({ ...formData, confirmPassword: text })}
                        />
                        <Text style={[
                            styles.label, 
                            focusedInput.confirmPassword ? styles.labelFocused : {}
                        ]}>
                            Confirm Password
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                    <Text style={styles.signin}>
                        Already have an account?{' '}
                        <Text
                            style={styles.signinLink}
                            onPress={() => navigation.navigate('Login')}
                        >
                            Login
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    form: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        marginBottom: 10,
        position: 'relative',
    },
    title: {
        fontSize: 28,
        color: 'royalblue',
        fontWeight: '600',
        letterSpacing: -1,
        marginLeft: 8,
    },
    dot: {
        position: 'absolute',
        left: 0,
        height: 18,
        width: 18,
        borderRadius: 50,
        backgroundColor: 'royalblue',
    },
    message: {
        color: 'rgba(88, 87, 87, 0.822)',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    flex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    inputContainer: {
        position: 'relative',
        flex: 1,
        marginBottom: 15,
        marginHorizontal: 5,
    },
    input: {
        width: '100%',
        padding: 10,
        paddingTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(105, 105, 105, 0.397)',
        borderRadius: 10,
        fontSize: 16,
        color: 'black',
    },
    label: {
        position: 'absolute',
        left: 12,
        top: 18,
        color: 'grey',
        fontSize: 14,
    },
    labelFocused: {
        top: 4,
        fontSize: 12,
        fontWeight: '600',
        color: 'royalblue',
    },
    submit: {
        backgroundColor: 'royalblue',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
    },
    signin: {
        color: 'rgba(88, 87, 87, 0.822)',
        textAlign: 'center',
        marginTop: 10,
    },
    signinLink: {
        color: 'royalblue',
        textDecorationLine: 'underline',
    },
});

export default SignupForm;
