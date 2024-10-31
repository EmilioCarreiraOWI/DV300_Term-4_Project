import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/index';
import { handleSignUp } from '../services/AuthService';
import { addUserToFirestore } from '../services/CreateUserService'; // Import the Firestore service

// Define the navigation prop type for SignUpScreen
type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUp = () => {
  // Hook to access navigation functionality
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const onSignUp = async () => {
    const result = await handleSignUp(email, password);
    if (result.success) {
      setModalVisible(true); // Show modal on successful sign-up
    } else {
      console.error(result.error);
    }
  };

  const onSubmitNameSurname = async () => {
    const userId = 'some-unique-user-id'; // Replace with actual user ID from auth
    const result = await addUserToFirestore(userId, name, surname);
    if (result.success) {
      setModalVisible(false);
      navigation.navigate('SignIn');
    } else {
      console.error(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brevio Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email..."
        placeholderTextColor="#7F8C8D"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password..."
        placeholderTextColor="#7F8C8D"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter Your Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Name..."
            placeholderTextColor="#7F8C8D"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Surname..."
            placeholderTextColor="#7F8C8D"
            value={surname}
            onChangeText={setSurname}
          />
          <TouchableOpacity style={styles.signUpButton} onPress={onSubmitNameSurname}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    fontSize: 44,
    color: '#F39C12',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    width: '80%',
    backgroundColor: '#34495E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    color: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  goBackButton: {
    backgroundColor: '#34495E',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 24,
    color: '#F39C12',
    marginBottom: 20,
  },
});

export default SignUp;
