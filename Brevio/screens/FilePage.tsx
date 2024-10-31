import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { firestore } from '../config/FirebaseConfig';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

interface DocumentData {
  folderName: string;
  description: string;
  summarizedText: string;
}

const FilePage = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const brevioFilesCollection = collection(firestore, 'Brevio_files');
        const querySnapshot = await getDocs(brevioFilesCollection);
        const docsData = querySnapshot.docs.map(doc => doc.data() as DocumentData);
        setDocuments(docsData.sort((a, b) => a.folderName.localeCompare(b.folderName)));
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchDocuments();

    const unsubscribe = onSnapshot(collection(firestore, 'Brevio_files'), (snapshot) => {
      const updatedDocsData = snapshot.docs.map(doc => doc.data() as DocumentData);
      setDocuments(updatedDocsData.sort((a, b) => a.folderName.localeCompare(b.folderName)));
    });

    return () => unsubscribe();
  }, []);

  const filteredDocuments = documents.filter(doc =>
    doc.folderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const groupDocumentsByLetter = (docs: DocumentData[]) => {
    return docs.reduce((acc, doc) => {
      const firstLetter = doc.folderName.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(doc);
      return acc;
    }, {} as Record<string, DocumentData[]>);
  };

  const groupedDocuments = groupDocumentsByLetter(filteredDocuments);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Documents</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        placeholderTextColor="#BDC3C7"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.documentContainer}>
        {Object.keys(groupedDocuments).sort().map(letter => (
          <View key={letter}>
            <Text style={styles.letterHeader}>{letter}</Text>
            {groupedDocuments[letter].map((doc, index) => (
              <TouchableOpacity key={index} style={styles.documentCard} onPress={() => handleDocumentPress(doc)}>
                <Text style={styles.documentTitle}>{doc.folderName}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingHorizontal: 20,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 28,
    marginVertical: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  documentContainer: {
    marginVertical: 10,
  },
  documentCard: {
    backgroundColor: '#34495E',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  documentTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signOutButton: {
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
  searchBar: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F39C12',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  letterHeader: {
    color: '#F39C12',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default FilePage;
