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
        <Text style={styles.ButtonText}>Click to Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scanButtonCommingSoon} onPress={navigateToAddPdf}>
        <Ionicons name="add" size={50} color="#F39C12" />
        <Text style={styles.ButtonText}>Add Your PDF</Text>
        <Text style={styles.ButtonTextCommingSoon}>(Coming Soon)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.scanButtonCommingSoon} onPress={navigateToCopyYourWork}>
        <Ionicons name="create" size={50} color="#F39C12" />
        <Text style={styles.ButtonText}>Add Your Copied work</Text>
        <Text style={styles.ButtonTextCommingSoon}>(Coming Soon)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    
  },
  logo: {
    color: '#F39C12',
    fontSize: 55,
    textAlign: 'center',
    marginVertical: 20,
  },
  scanButtonActive : {
    backgroundColor: '#232323',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    height: '20%',
    marginBottom: 20,
  },
  scanButtonCommingSoon : {
    backgroundColor: 'rgba(35, 35, 35, 0.5)',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    height: '20%',
    marginBottom: 20,
  },
  ButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  ButtonTextCommingSoon: {
    color: '#F39C12',
    fontSize: 18,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    margin: 10,
  },
  documentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  document: {
    width: '45%',
    backgroundColor: '#F39C12',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default HomePage;
