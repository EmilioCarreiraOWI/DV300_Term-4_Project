import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../app/index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/FirebaseConfig'; // Adjust the path as necessary
import { handleLogin } from '../services/AuthService'; // Import the handleLogin function

// Define the navigation prop type for SignInScreen
type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

const LoginPage = () => {
  // State hooks for managing form inputs and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hook to access navigation functionality
  const navigation = useNavigation<SignInScreenNavigationProp>();

  // Function to handle sign in button press
  const handleSignIn = async () => {
    try {
      await handleLogin(email, password); // Use handleLogin from AuthService
      console.log('Sign In pressed');
    } catch (err) {
      setError('Invalid email or password'); // Assuming the error thrown is related to invalid credentials
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brevio</Text>
      <TextInput
        style={styles.input}
        placeholder="Email..."
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password..."
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
  },
  title: {
    fontSize: 48,
    color: '#E67E22',
    marginBottom: 40,
  },
  input: {
    width: '80%',
    backgroundColor: '#34495E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  signUpButton: {
    backgroundColor: '#34495E',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#F39C12',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default LoginPage;
