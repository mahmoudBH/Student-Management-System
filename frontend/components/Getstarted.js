import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const GetStartedButton = () => {
  const navigation = useNavigation();
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
    navigation.navigate('Login'); // Assurez-vous que votre page de connexion s'appelle bien "Login"
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Get started</Text>
          <View style={styles.icon}>
            <Svg height="24" width="24" viewBox="0 0 24 24">
              <Path d="M0 0h24v24H0z" fill="none" />
              <Path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                fill="#7b52b9"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#a370f0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 60,
    width: 250,
    shadowColor: '#7b52b9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.75,
  },
  icon: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    shadowColor: '#7b52b9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default GetStartedButton;
