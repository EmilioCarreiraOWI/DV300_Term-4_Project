import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Brevio</Text>
      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Click for Scan</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Recent Scan</Text>
      <View style={styles.documentContainer}>
        {/* Placeholder for documents */}
        <View style={styles.document}>
          <Text style={styles.title}>Document 1</Text>
        </View>
        <View style={styles.document}>
          <Text style={styles.title}>Document 2</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  logo: {
    color: '#F39C12',
    fontSize: 36,
    textAlign: 'center',
    marginVertical: 20,
  },
  scanButton: {
    backgroundColor: '#34495E',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanButtonText: {
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
    backgroundColor: '#34495E',
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
