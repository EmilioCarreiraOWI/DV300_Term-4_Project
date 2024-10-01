import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ScanPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Brevio</Text>
      <View style={styles.scanContainer}>
        {/* <Image source={require('../assets/contract.png')} style={styles.scanImage} /> */}
        <View style={styles.scanOverlay}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
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
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'cover',
  },
  scanOverlay: {
    position: 'absolute',
    width: '90%',
    height: '70%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#000',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: '#000',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#000',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: '#000',
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

export default ScanPage;
