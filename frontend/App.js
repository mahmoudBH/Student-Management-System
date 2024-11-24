import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Login from './components/Login';
import SignupForm from './components/Signup';
import Home from './components/Home';
import Logout from './components/Logout';
import Profile from './components/Profile';
import MesNotes from './components/MesNotes';
import MesCours from './components/MesCours';
import Contact from './components/Contact';
import Support from './components/Support';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ setIsLoggedIn, refreshData, isLoggedIn, ...props }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('http://192.168.32.100:4000/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setProfilePhoto(data.data.profile_photo);
          setFirstName(data.data.firstname);
          setLastName(data.data.lastname);
        } else {
          await AsyncStorage.multiRemove(['token', 'firstname', 'lastname', 'profile_photo']);
          setIsLoggedIn(false);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [refreshData, isLoggedIn]);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        fetchUserData();
      }
    }, [refreshData, isLoggedIn])
  );

  return (
    <View style={styles.drawerContent}>
      {isLoggedIn ? (
        <>
          {profilePhoto && (
            <Image
              source={{ uri: profilePhoto }}
              style={styles.profilePhoto}
            />
          )}
          <Text style={styles.userName}>{firstName} {lastName}</Text>
        </>
      ) : (
        <Image
          source={require('./assets/digital-student.png')}
          style={styles.defaultLogo}
        />
      )}
      <DrawerItemList {...props} />
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyrightText}>© 2024 Mahmoud Bousbih. All rights reserved.</Text>
      </View>
    </View>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setRefreshData(prev => !prev);
    }
  }, [isLoggedIn]);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#E3F2FD',
            width: 280,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1A237E',
          },
          drawerActiveBackgroundColor: '#BBDEFB',
          drawerActiveTintColor: '#0D47A1',
          drawerInactiveTintColor: '#1A237E',
          headerStyle: {
            backgroundColor: '#0D47A1',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            setIsLoggedIn={setIsLoggedIn}
            refreshData={refreshData}
            isLoggedIn={isLoggedIn}
          />
        )}
      >
        {!isLoggedIn ? (
          <>
            <Drawer.Screen
              name="Login"
              options={{
                title: 'Login',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="login" color={color} size={20} />
                ),
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
              name="MesNotes"
              component={MesNotes}
              options={{
                title: 'My Grades',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="notebook" color={color} size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="MesCours"
              component={MesCours}
              options={{
                title: 'My Courses',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="book-open" color={color} size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="Profile"
              options={{
                title: 'Profile',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={20} />
                ),
              }}
            >
              {(props) => <Profile {...props} setIsLoggedIn={setIsLoggedIn} setRefreshData={setRefreshData} />}
            </Drawer.Screen>
            <Drawer.Screen
              name="Contact"
              component={Contact}
              options={{
                title: 'Contact',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account-box" color={color} size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="Support"
              component={Support}
              options={{
                title: 'Support',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="lifebuoy" color={color} size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="Logout"
              options={{
                title: 'Logout',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="logout" color={color} size={20} />
                ),
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
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
    borderColor: '#1A237E',
    borderWidth: 2,
  },
  defaultLogo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 20,
  },
  copyrightContainer: {
    marginTop: 'auto',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: '#757575',
  },
});

export default App;
