import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CopyYourWork = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Copy Your Work</Text>
      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>This feature is coming soon!</Text>
        <Text style={styles.descriptionText}>
          Here you will be able to copy any work and add it to this page. This page will summarize any text in the input field.
        </Text>
      </View>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.navigate('Home' as never)}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    margin: 10,
    marginHorizontal: 20,
  },
  comingSoonContainer: {
    backgroundColor: '#34495E',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 10,
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  goBackButton: {
    backgroundColor: '#F39C12',
    padding: 10,
    margin: 10,
    width: '98%',
    borderRadius: 5,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CopyYourWork;
