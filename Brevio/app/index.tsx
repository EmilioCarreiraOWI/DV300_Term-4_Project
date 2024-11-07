import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import HomePage from '../screens/HomePage';
import ScanPage from '../screens/ScanPage';
import FilePage from '../screens/FilePage';
import DocumentDetailPage from '../screens/DocumentDetailPage';
import { auth } from '../config/FirebaseConfig';

// Define the types for navigation parameters
export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  File: undefined;
  'Copy Your Work': undefined;
  'Add your PDF': undefined;
  SignIn: undefined;
  SignUp: undefined;
  DocumentDetail: { document: Document };
  HomeTab: undefined;
};

// Create stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Scan':
              iconName = focused ? 'scan' : 'scan-outline';
              break;
            case 'File':
              iconName = focused ? 'file-tray' : 'file-tray-outline';
              break;
            default:
              iconName = 'alert-circle-outline'; // Default icon
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#323232',
        tabBarStyle: { backgroundColor: '#F39C12' },
        headerStyle: { backgroundColor: '#34495E' },
        headerTintColor: '#F39C12',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Scan" component={ScanPage} />
      <Tab.Screen name="File" component={FilePage} />
    </Tab.Navigator>
  );
}

// Main component
export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log("User logged in... UID: " + user.uid);
      } else {
        setLoggedIn(false);
        console.log("No user logged in...");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2C3E50' },
        headerTintColor: '#F39C12',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {loggedIn ? (
        <>
          <Stack.Screen name="HomeTab" component={BottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="DocumentDetail" component={DocumentDetailPage} options={{ headerShown: true }} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}
