import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { firestore } from '../config/FirebaseConfig'; // Import Firestore
import { collection, getDocs, onSnapshot } from 'firebase/firestore'; // Import Firestore functions

interface DocumentData {
  folderName: string;
  description: string;
  summarizedText: string;
}

const FilePage = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const brevioFilesCollection = collection(firestore, 'Brevio_files');
        const querySnapshot = await getDocs(brevioFilesCollection);
        const docsData = querySnapshot.docs.map(doc => doc.data() as DocumentData);
        setDocuments(docsData);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchDocuments();

    const unsubscribe = onSnapshot(collection(firestore, 'Brevio_files'), (snapshot) => {
      const updatedDocsData = snapshot.docs.map(doc => doc.data() as DocumentData);
      setDocuments(updatedDocsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('SignIn' as never);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleDocumentPress = (document: DocumentData) => {
    navigation.navigate('DocumentDetail', { document });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Documents</Text>
      <View style={styles.documentContainer}>
        {documents.map((doc, index) => (
          <TouchableOpacity key={index} style={styles.documentCard} onPress={() => handleDocumentPress(doc)}>
            <Text style={styles.documentTitle}>{doc.folderName}</Text>
            <Text style={styles.documentDescription}>{doc.description}</Text>
            <Text style={styles.documentSummary}>{doc.summarizedText}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
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
    marginHorizontal: 20,
  },
  documentContainer: {
    marginHorizontal: 20,
  },
  documentCard: {
    backgroundColor: '#34495E',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  documentTitle: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  documentDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  documentSummary: {
    color: '#FFFFFF',
    fontSize: 16,
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
