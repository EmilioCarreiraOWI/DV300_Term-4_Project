import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { firestore } from '../config/FirebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

interface DocumentData {
  id: string;
  folderName: string;
  description: string;
  summarizedText: string;
  imageUrl: string;
}

type DocumentDetailRouteProp = RouteProp<{ params: { document: DocumentData } }, 'params'>;

const DocumentDetailPage = () => {
  const route = useRoute<DocumentDetailRouteProp>();
  const { document } = route.params;

  const handleDelete = async () => {
    const documentRef = doc(firestore, 'documents', document.id);
    try {
      await deleteDoc(documentRef);
      Alert.alert('Success', 'Document deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete document');
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{document.folderName}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image style={styles.image} src={document.imageUrl} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summary}>{document.summarizedText}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{document.description}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Document</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    padding: 10,
  },
  header: {
    backgroundColor: '#34495E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
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
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#34495E',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  summary: {
    color: '#FFFFFF',
    fontSize: 16,
    padding: 10,
    backgroundColor: '#34495E',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#34495E',
    borderRadius: 10,
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,

  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    resizeMode: 'contain',    
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentDetailPage;
