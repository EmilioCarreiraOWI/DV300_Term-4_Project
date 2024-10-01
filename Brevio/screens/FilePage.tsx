import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';

const documents = [
  { title: 'Document 1', image: { uri: 'https://picsum.photos/200/300?random=1' } },
  { title: 'Document 2', image: { uri: 'https://picsum.photos/200/300?random=2' } },
  { title: 'Document 3', image: { uri: 'https://picsum.photos/200/300?random=3' } },
  { title: 'Document 4', image: { uri: 'https://picsum.photos/200/300?random=4' } },
  { title: 'Document 5', image: { uri: 'https://picsum.photos/200/300?random=5' } },
  { title: 'Document 6', image: { uri: 'https://picsum.photos/200/300?random=6' } },
];

const FilePage = () => {
  const navigation = useNavigation();
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('SignIn' as never);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Stared</Text>
      <View style={styles.documentRow}>
        {documents.slice(0, 2).map((doc, index) => (
          <View key={index} style={styles.document}>
            <Image source={doc.image} style={styles.image} />
            <Text style={styles.title}>{doc.title}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.header}>A - Z</Text>
      <View style={styles.documentRow}>
        {documents.slice(2).map((doc, index) => (
          <View key={index} style={styles.document}>
            <Image source={doc.image} style={styles.image} />
            <Text style={styles.title}>{doc.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    margin: 10,
  },
  documentRow: {
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
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    padding: 10,
  },
  signOutButton: {
    backgroundColor: '#E74C3C',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default FilePage;
