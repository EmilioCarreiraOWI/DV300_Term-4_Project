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
import AddPdf from '../screens/AddPdf';
import CopyYourWork from '../screens/CopyYourWork';
import DocumentDetailPage from '../screens/DocumentDetailPage';
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
  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log("User logged in..." + user.email);
      } else {
        setLoggedIn(false);
        console.log("No user logged in...");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator>
      {loggedIn ? (
        <>
          <Stack.Screen name="Home" component={BottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="DocumentDetail" component={DocumentDetailPage} options={{ headerShown: true }} />
          <Stack.Screen name="Copy Your Work" component={CopyYourWork} />
          <Stack.Screen name="Add your PDF" component={AddPdf} />
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
