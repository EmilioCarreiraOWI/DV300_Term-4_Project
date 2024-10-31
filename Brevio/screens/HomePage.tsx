import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app';
import { useNavigation } from '@react-navigation/native';

// Define the navigation prop type for HomePage
type HomePageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomePage = () => {
  const navigation = useNavigation<HomePageNavigationProp>();

  const navigateToScanPage = () => {
    navigation.navigate('Scan');
  };

  const navigateToAddPdf = () => {
    navigation.navigate('AddPdf');
  };

  const navigateToCopyYourWork = () => {
    navigation.navigate('CopyYourWork');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Brevio</Text>

      <TouchableOpacity style={styles.scanButtonActive} onPress={navigateToScanPage}>
        <Ionicons name="camera" size={50} color="#F39C12" />
        <Text style={styles.buttonText}>Scan Document</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scanButtonComingSoon} onPress={navigateToAddPdf}>
        <Ionicons name="document" size={50} color="#F39C12" />
        <Text style={styles.buttonText}>Add PDF</Text>
        <Text style={styles.buttonTextComingSoon}>(Coming Soon)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.scanButtonComingSoon} onPress={navigateToCopyYourWork}>
        <Ionicons name="clipboard" size={50} color="#F39C12" />
        <Text style={styles.buttonText}>Copy Work</Text>
        <Text style={styles.buttonTextComingSoon}>(Coming Soon)</Text>
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
  },
  scanButtonActive: {
    backgroundColor: '#232323',
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
  scanButtonComingSoon: {
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonTextComingSoon: {
    color: '#F39C12',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default HomePage;
