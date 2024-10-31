import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { addUserToFirestore } from '../services/CreateUserService';
import { signOut } from 'firebase/auth';

// Define the navigation prop type for HomePage
type HomePageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Define the Profile type
interface Profile {
  name: string;
  surname: string;
  email: string;
  // Add other fields as necessary
}

const HomePage = () => {
  const navigation = useNavigation<HomePageNavigationProp>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const userId = auth.currentUser?.uid || '';
  const email = auth.currentUser?.email; // Ensure this is using the auth from FirebaseConfig
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) { // Check if userId is available
        const docRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        } else {
          setProfile(null);
        }
      }
    };

    fetchUserProfile();
  }, [userId]);

  const navigateToScanPage = () => {
    navigation.navigate('Scan');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('SignIn' as never);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleCreateProfile = async () => {
    const result = await addUserToFirestore(userId, name, surname, email);
    if (result.success) {
      // Refetch the profile to update the UI
      const docRef = doc(firestore, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as Profile);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Brevio</Text>

      <View style={styles.section}>
        {profile ? (
          <>
              <Text style={styles.headerText}>Sign In as:</Text>
              <View style={styles.sectionText}>
                <Text style={styles.buttonTextName}>{profile?.name} {profile?.surname}</Text>
                <Text style={styles.buttonTextEmail}>{profile?.email}</Text>
              </View>
              <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </TouchableOpacity>
              
          </>
        ) : (
          <>
            <View>
              <Text style={styles.headerText}>Finishing up your Profile</Text>
            </View>
            
            {imageUri && <Image source={{ uri: imageUri }} style={styles.profileImage} />}
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              placeholderTextColor={'#888'}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Surname"
              value={surname}
              placeholderTextColor={'#888'}
              onChangeText={setSurname}
            />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateProfile}>
              <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.scanButtonActive} onPress={navigateToScanPage}>
        <Ionicons name="camera" size={50} color="#fff" />
        <Text style={styles.buttonText}>Scan Document</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    color: '#F39C12',
    fontSize: 55,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  headerText: {
    color: '#F39C12',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scanButtonActive: {
    backgroundColor: '#F39C12',
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  profileView: {
    backgroundColor: 'rgba(35, 35, 35, 0.5)',
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  createButton: {
    backgroundColor: '#F39C12',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  buttonTextName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonTextEmail: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(35, 35, 35, 0.5)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  sectionTitle: {
    color: '#F39C12',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34495E',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  signOutButton: {
    width: '90%',
    backgroundColor: '#E74C3C',
    padding: 12,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomePage;
