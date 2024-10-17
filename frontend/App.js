// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GetStartedButton from './components/Getstarted'; // Adjust the import path if necessary
import Login from './components/Login'; // Adjust the import path if necessary
import SignupForm from './components/Signup'; // Adjust the import path if necessary
import Home from './components/Home'; // Assurez-vous que le chemin d'import est correct

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetStartedButton">
        <Stack.Screen 
          name="GetStartedButton" 
          component={GetStartedButton} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="SignupForm" 
          component={SignupForm} 
          options={{ title: 'Sign Up' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Welcome' }} // Optional title for the Home screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
