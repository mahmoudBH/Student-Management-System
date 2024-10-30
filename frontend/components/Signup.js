<<<<<<< HEAD
// Signup.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Alert } from 'react-native';
=======
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8

const { width } = Dimensions.get('window');

const SignupForm = ({ navigation }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
<<<<<<< HEAD
    const [focusedInput, setFocusedInput] = useState({});

=======
    const [selectedClass, setSelectedClass] = useState(''); // State for the class
    const [focusedInput, setFocusedInput] = useState({});
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
    const pulseAnim = new Animated.Value(1);

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

    const handleSignup = () => {
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }
<<<<<<< HEAD
        if (!firstname || !lastname || !email || !password) {
=======
        if (!firstname || !lastname || !email || !password || !selectedClass) {
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
            Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
            return;
        }

<<<<<<< HEAD
        const data = { firstname, lastname, email, password };

        // Envoie des données à l'API backend
        fetch('http://192.168.1.135:3000/api/signup', {
=======
        const data = { firstname, lastname, email, password, class: selectedClass };

        // Envoie des données à l'API backend
        fetch('http://192.168.90.123:3000/api/signup', {
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
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
                    navigation.navigate('Login'); // Rediriger vers la page de connexion
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
                                placeholder=" "
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
                                placeholder=" "
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
                            placeholder=" "
                            keyboardType="email-address"
                            onFocus={() => setFocusedInput({ email: true })}
                            onBlur={() => setFocusedInput({ email: false })}
                        />
                        <Text style={[styles.label, focusedInput.email || email ? styles.labelFocused : {}]}>
                            Email
                        </Text>
                    </View>
<<<<<<< HEAD
=======

                    {/* Class Picker */}
                    <View style={styles.inputContainer}>
                        <Picker
                            selectedValue={selectedClass}
                            style={[styles.input, { height: 50 }]} // Adjust height for the picker
                            onValueChange={(itemValue) => setSelectedClass(itemValue)}
                        >
                            <Picker.Item label="Select Class" value="" />
                            <Picker.Item label="TI11" value="TI11" />
                            <Picker.Item label="TI12" value="TI12" />
                            <Picker.Item label="TI13" value="TI13" />
                            <Picker.Item label="TI14" value="TI14" />
                            <Picker.Item label="DSI21" value="DSI21" />
                            <Picker.Item label="DSI22" value="DSI22" />
                            <Picker.Item label="DSI31" value="DSI31" />
                            <Picker.Item label="DSI32" value="DSI32" />
                        </Picker>
                        <Text style={[styles.label, selectedClass ? styles.labelFocused : {}]}>
                            Class
                        </Text>
                    </View>

>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder=" "
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
                            placeholder=" "
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
<<<<<<< HEAD
        transition: 'top 0.2s, fontSize 0.2s', // CSS transition for smooth animation
    },
    labelFocused: {
        top: 4,
        fontSize: 12,
        fontWeight: '600',
=======
        transition: 'all 0.2s ease',
    },
    labelFocused: {
        top: 0,
        fontSize: 12,
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
        color: 'royalblue',
    },
    submit: {
        backgroundColor: 'royalblue',
<<<<<<< HEAD
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
=======
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
<<<<<<< HEAD
    },
    signin: {
        color: 'rgba(88, 87, 87, 0.822)',
        textAlign: 'center',
        marginTop: 10,
    },
    signinLink: {
        color: 'royalblue',
        textDecorationLine: 'underline',
=======
        fontWeight: '600',
    },
    signin: {
        textAlign: 'center',
        marginTop: 15,
    },
    signinLink: {
        color: 'royalblue',
        fontWeight: '600',
>>>>>>> d4a752366ca87e8fbc60ba697b32d1febe6d72e8
    },
});

export default SignupForm;