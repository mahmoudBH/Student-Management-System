// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import GetStartedButton from './components/Getstarted'; // Adjust the import path if necessary
import Login from './components/Login'; // Adjust the import path if necessary
import SignupForm from './components/Signup'; // Adjust the import path if necessary
import Home from './components/Home'; // Ensure the import path is correct

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name=" Home Screen" 
        component={Home} 
      />
      {/* Vous pouvez ajouter d'autres écrans ici si nécessaire */}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="GetStartedButton">
        <Drawer.Screen 
          name="GetStartedButton" 
          component={GetStartedButton} 
          options={{ headerShown: false }} 
        />
        <Drawer.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login' }} 
        />
        <Drawer.Screen 
          name="SignupForm" 
          component={SignupForm} 
          options={{ title: 'Sign Up' }} 
        />
        <Drawer.Screen 
          name="Home" // Change from Home to HomeStack
          component={HomeStack} 
          options={{ title: 'Home' }} 
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
