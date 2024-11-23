import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Alert, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const SignupForm = ({ navigation }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [focusedInput, setFocusedInput] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);
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
        if (!firstname || !lastname || !email || !password || !selectedClass) {
            Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
            return;
        }

        const data = { firstname, lastname, email, password, class: selectedClass };

        fetch('http://192.168.32.100:4000/api/signup', {
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
                    navigation.navigate('Login');
                } else {
                    Alert.alert('Erreur', data.message);
                }
            })
            .catch(error => {
                Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
            });
    };

    const onRefresh = () => {
        setIsRefreshing(true);
        // Simulate a network request or reset your form values
        setTimeout(() => {
            setFirstname('');
            setLastname('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setSelectedClass('');
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

                    {/* Enhanced Class Picker */}
                    <View style={styles.inputContainer}>
    <View style={[styles.input, styles.pickerContainer]}>
        <Picker
            selectedValue={selectedClass}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedClass(itemValue)}
        >
            <Picker.Item label="" value="" />
            <Picker.Item label="TI11" value="TI11" />
            <Picker.Item label="TI12" value="TI12" />
            <Picker.Item label="TI13" value="TI13" />
            <Picker.Item label="TI14" value="TI14" />
            <Picker.Item label="DSI21" value="DSI21" />
            <Picker.Item label="DSI22" value="DSI22" />
            <Picker.Item label="DSI31" value="DSI31" />
            <Picker.Item label="DSI32" value="DSI32" />
        </Picker>
    </View>
    <Text style={[styles.label, selectedClass ? styles.labelFocused : {}]}>
        Class
    </Text>
</View>


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
        backgroundColor: '#f9fafb', // Couleur plus claire pour le fond
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
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#e5e7eb', // Ajout d'une bordure subtile
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        marginBottom: 20,
        position: 'relative',
    },
    title: {
        fontSize: 28,
        color: '#2563eb', // Couleur bleue plus douce
        fontWeight: '700',
        letterSpacing: -0.5,
        marginLeft: 8,
    },
    dot: {
        position: 'absolute',
        left: 0,
        height: 18,
        width: 18,
        borderRadius: 50,
        backgroundColor: '#2563eb',
    },
    message: {
        color: '#6b7280', // Gris doux pour le texte secondaire
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
        marginBottom: 20,
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
        transition: '0.2s',
    },
    labelFocused: {
        top: -5,
        fontSize: 12,
        fontWeight: '600',
        color: 'royalblue',
    },
    submit: {
        backgroundColor: '#2563eb',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    signin: {
        textAlign: 'center',
        marginTop: 20,
        color: '#6b7280',
    },
    signinLink: {
        color: '#2563eb',
        fontWeight: '700',
    },
    picker: {
        height: 50,
        width: '100%',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: -5,
    },
});


export default SignupForm;
