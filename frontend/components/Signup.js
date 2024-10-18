import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Alert } from 'react-native';


const { width } = Dimensions.get('window');

const SignupForm = ({ navigation }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState({});

    const pulseAnim = new Animated.Value(1);

    Animated.loop(
        Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.8, duration: 1000, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
    ).start();

    const handleSignup = () => {
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        const data = { firstname, lastname, email, password };

        // Envoie des données à l'API backend
        fetch('http://172.16.27.191:5000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Alert.alert('Succès', 'Inscription réussie!');
                } else {
                    Alert.alert('Erreur', data.message);
                }
            })
            .catch(error => {
                Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
            });
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
                                value={firstname}
                                onChangeText={setFirstname}
                                onFocus={() => setFocusedInput({ firstname: true })}
                                onBlur={() => setFocusedInput({ firstname: false })}
                            />
                            <Text style={[styles.label, focusedInput.firstname || firstname ? styles.labelFocused : {}]}>
                                Firstname
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={lastname}
                                onChangeText={setLastname}
                                onFocus={() => setFocusedInput({ lastname: true })}
                                onBlur={() => setFocusedInput({ lastname: false })}
                            />
                            <Text style={[styles.label, focusedInput.lastname || lastname ? styles.labelFocused : {}]}>
                                Lastname
                            </Text>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            onFocus={() => setFocusedInput({ email: true })}
                            onBlur={() => setFocusedInput({ email: false })}
                        />
                        <Text style={[styles.label, focusedInput.email || email ? styles.labelFocused : {}]}>
                            Email
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onFocus={() => setFocusedInput({ password: true })}
                            onBlur={() => setFocusedInput({ password: false })}
                        />
                        <Text style={[styles.label, focusedInput.password || password ? styles.labelFocused : {}]}>
                            Password
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            onFocus={() => setFocusedInput({ confirmPassword: true })}
                            onBlur={() => setFocusedInput({ confirmPassword: false })}
                        />
                        <Text style={[styles.label, focusedInput.confirmPassword || confirmPassword ? styles.labelFocused : {}]}>
                            Confirm Password
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.submit} onPress={handleSignup}>
                        <Text style={styles.submitText}>Sign Up</Text>
                    </TouchableOpacity>

                    <Text style={styles.signin}>
                        Already have an account?{' '}
                        <Text style={styles.signinLink} onPress={() => navigation.navigate('Login')}>
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
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 5,
        marginBottom: 15,
        position: 'relative',
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
        transition: 'top 0.2s, fontSize 0.2s', // CSS transition for smooth animation
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
