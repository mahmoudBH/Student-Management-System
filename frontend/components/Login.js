import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Login = ({ setIsLoggedIn }) => {
    const pulseAnim = new Animated.Value(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoggedIn, setIsLoggedInState] = useState(false);  // New state to track login status

    useEffect(() => {
        const animationLoop = Animated.loop(
            Animated.sequence([ 
                Animated.timing(pulseAnim, { toValue: 1.8, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        );
        animationLoop.start();
        return () => animationLoop.stop();
    }, [pulseAnim]);

    useEffect(() => {
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setIsLoggedInState(true);  // Update the state to reflect that the user is logged in
            }
        };
        checkLogin();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await fetch('http://192.168.32.100:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Une erreur est survenue lors de la connexion.');
            }

            const data = await response.json();

            if (data.success) {
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('class', data.user.class);

                if (data.user.profile_photo) {
                    await AsyncStorage.setItem('profile_photo', data.user.profile_photo);
                }

                Alert.alert('Succès', 'Connexion réussie!');
                setIsLoggedIn(true);
                setIsLoggedInState(true);  // Set login state to true after successful login
            } else {
                Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
            }
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.');
            console.error('Login Error:', error);
        }
    };

    const onRefresh = () => {
        setIsRefreshing(true);
        // Reset form fields
        setEmail('');
        setPassword('');
        setFocusedInput({});

        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000); // Adjust the duration as needed
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.form}>
                    <View style={styles.titleContainer}>
                        <View style={styles.dot} />
                        <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
                        <Text style={styles.title}>Login</Text>
                    </View>
                    <Text style={styles.message}>Login to access your account.</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder=" "
                            keyboardType="email-address"
                            onFocus={() => setFocusedInput({ email: true })}
                            onBlur={() => setFocusedInput({ email: false })}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Animated.Text style={[
                            styles.label,
                            focusedInput.email || email.length > 0 ? styles.labelFocused : {}
                        ]}>
                            Email
                        </Animated.Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder=" "
                            secureTextEntry
                            onFocus={() => setFocusedInput({ password: true })}
                            onBlur={() => setFocusedInput({ password: false })}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Animated.Text style={[
                            styles.label,
                            focusedInput.password || password.length > 0 ? styles.labelFocused : {}
                        ]}>
                            Password
                        </Animated.Text>
                    </View>

                    <TouchableOpacity style={styles.submit} onPress={handleLogin}>
                        <Text style={styles.submitText}>Login</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>
                        Don’t have an account?{' '}
                        <Text
                            style={styles.link}
                            // No navigation, you can handle this manually if needed
                        >
                            Sign Up
                        </Text>
                    </Text>
                </View>

                {/* Conditionally render Home page or a message based on login status */}
                {isLoggedIn && (
                    <View style={styles.loggedInMessage}>
                        <Text style={styles.loggedInText}>Vous êtes connecté!</Text>
                    </View>
                )}
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
        transition: '0.2s',
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
    text: {
        color: 'rgba(88, 87, 87, 0.822)',
        textAlign: 'center',
        marginTop: 10,
    },
    link: {
        color: 'royalblue',
        textDecorationLine: 'underline',
    },
    loggedInMessage: {
        padding: 20,
        backgroundColor: '#d4f8e8',
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    loggedInText: {
        fontSize: 18,
        color: 'green',
    },
});

export default Login;
