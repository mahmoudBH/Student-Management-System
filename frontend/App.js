// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GetStartedButton from './components/Getstarted'; // Adjust the import path if necessary
import Login from './components/Login'; // Adjust the import path if necessary
import SignupForm from './components/Signup'; // Adjust the import path if necessary

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
          options={{ title: 'Login' }} // Optional title for the Login screen
        />
        <Stack.Screen 
          name="SignupForm" 
          component={SignupForm} 
          options={{ title: 'Sign Up' }} // Optional title for the Signup screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
