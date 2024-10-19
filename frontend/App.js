import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Login from './components/Login'; 
import SignupForm from './components/Signup'; 
import Home from './components/Home'; 
import Logout from './components/Logout'; // Import the Logout component

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
        <Drawer.Screen 
          name="Login" 
          component={Login} 
          options={{ 
            title: 'Login', 
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="login" color={color} size={20} />
            ) 
          }} 
        />
        <Drawer.Screen 
          name="SignupForm" 
          component={SignupForm} 
          options={{ 
            title: 'Sign Up', 
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-plus" color={color} size={20} />
            ) 
          }} 
        />
        <Drawer.Screen 
          name="Home" 
          component={Home} 
          options={{ 
            title: 'Home', 
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={20} />
            ) 
          }} 
        />
        <Drawer.Screen 
          name="Logout" 
          component={Logout} 
          options={{ 
            title: 'Logout', 
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="logout" color={color} size={20} />
            ) 
          }} 
        />
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
