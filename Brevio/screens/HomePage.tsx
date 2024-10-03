import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Brevio</Text>
      <TouchableOpacity style={styles.scanButton}>
        <Ionicons name="camera" size={50} color="#F39C12" />
        <Text style={styles.ButtonText}>Click for Scan</Text>
      </TouchableOpacity>
      {/* Placeholder for documents */}
      <TouchableOpacity style={styles.scanButton}>
        <Ionicons name="add" size={50} color="#F39C12" />
        <Text style={styles.ButtonText}>Add Your PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.scanButton}>
        <Ionicons name="create" size={50} color="#F39C12" />
        <Text style={styles.ButtonText}>Add Your Copied work</Text>
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
  scanButton: {
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
  ButtonText: {
    color: '#FFFFFF',
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F39C12',
    paddingVertical: 10,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default HomePage;
