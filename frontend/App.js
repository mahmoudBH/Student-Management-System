import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To store and retrieve the token
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Login from './components/Login';
import SignupForm from './components/Signup';
import Home from './components/Home';
import Logout from './components/Logout'; // Ensure this is correctly imported

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <View style={styles.drawerContent}>
      <Text style={styles.drawerHeader}>My App</Text>
      <DrawerItemList {...props} />
    </View>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Function to check the token and update login status
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true); // User is logged in if a valid token is found
      } else {
        setIsLoggedIn(false); // No token, so user is not logged in
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  // Check login status when the app loads
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#f4f4f4',
            width: 240,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
          },
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {/* If the user is not logged in, show Login and Signup */}
        {!isLoggedIn ? (
          <>
            <Drawer.Screen 
              name="Login" 
              options={{ 
                title: 'Login', 
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="login" color={color} size={20} />
                ) 
              }}
            >
              {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Drawer.Screen>


            <Drawer.Screen
              name="SignupForm"
              component={SignupForm}
              options={{
                title: 'Sign Up',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account-plus" color={color} size={20} />
                ),
              }}
            />
          </>
        ) : (
          <>
            {/* If the user is logged in, show Home and Logout */}
            <Drawer.Screen
              name="Home"
              component={Home}
              options={{
                title: 'Home',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={20} />
                ),
              }}
            />
            <Drawer.Screen 
              name="Logout" 
              options={{ 
                title: 'Logout', 
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="logout" color={color} size={20} />
                ) 
              }}
            >
              {() => <Logout setIsLoggedIn={setIsLoggedIn} />}
            </Drawer.Screen>

          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 20,
  },
});

export default App;
