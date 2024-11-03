import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
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

const CustomDrawerContent = ({ setIsLoggedIn, ...props }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('http://192.168.228.100:4000/api/profile', {
          method: 'GET', // Utiliser la méthode GET
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          // Mise à jour des états avec les données reçues
          setProfilePhoto(data.data.profile_photo);
          setFirstName(data.data.firstname);
          setLastName(data.data.lastname);
        } else {
          // Déconnexion si la récupération échoue
          await AsyncStorage.multiRemove(['token', 'firstname', 'lastname', 'profile_photo']);
          setIsLoggedIn(false);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  

  useEffect(() => {
    fetchUserData();
  }, []); // Le tableau vide signifie que cela s'exécute uniquement au montage

  return (
    <View style={styles.drawerContent}>
      {profilePhoto && (
        <Image
          source={{ uri: profilePhoto }}
          style={styles.profilePhoto}
        />
      )}
      <Text style={styles.userName}>{firstName} {lastName}</Text>
      <DrawerItemList {...props} />
    </View>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#E3F2FD', // Fond bleu clair du drawer
            width: 280,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1A237E', // Couleur bleu foncé des labels
          },
          drawerActiveBackgroundColor: '#BBDEFB', // Fond bleu clair de l'élément actif
          drawerActiveTintColor: '#0D47A1', // Couleur bleu foncé de texte de l'élément actif
          drawerInactiveTintColor: '#1A237E', // Couleur bleu foncé des éléments inactifs
          headerStyle: {
            backgroundColor: '#0D47A1', // Fond bleu foncé de l'en-tête
          },
          headerTintColor: '#FFF', // Couleur du texte blanc de l'en-tête
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} setIsLoggedIn={setIsLoggedIn} />}
      >
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
                title: 'Mes Notes',
                drawerIcon: ({ color }) => (
                  <MaterialCommunityIcons name="notebook" color={color} size={20} />
                ),
              }}
            />
            <Drawer.Screen
              name="MesCours"
              component={MesCours}
              options={{
                title: 'Mes Cours',
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
                ) 
              }}
            >
              {(props) => <Profile {...props} setIsLoggedIn={setIsLoggedIn} />}
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
    backgroundColor: '#ffff', // Fond bleu clair du drawer
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    alignSelf: 'center',
    borderColor: '#1A237E', // Couleur bleu foncé de bordure pour la photo
    borderWidth: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1', // Couleur bleu foncé du texte pour le nom
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default App;
