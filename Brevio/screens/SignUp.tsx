import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/index'; // Adjust the path as necessary

// Define the navigation prop type for SignUpScreen
type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUp = () => {
  // Hook to access navigation functionality
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brevio</Text>
      <TextInput
        style={styles.input}
        placeholder="Email..."
        placeholderTextColor="#7F8C8D"
      />
      <TextInput
        style={styles.input}
        placeholder="Password..."
        placeholderTextColor="#7F8C8D"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => {/* Add sign up logic here */}}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#F39C12',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  goBackButton: {
    backgroundColor: '#34495E',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SignUp;
