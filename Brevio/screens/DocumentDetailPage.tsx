import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

interface DocumentData {
  folderName: string;
  description: string;
  summarizedText: string;
}

type DocumentDetailRouteProp = RouteProp<{ params: { document: DocumentData } }, 'params'>;

const DocumentDetailPage = () => {
  const route = useRoute<DocumentDetailRouteProp>();
  const { document } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{document.folderName}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summary}>{document.summarizedText}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{document.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    padding: 10, // Adjusted padding to match ScanPage
  },
  title: {
    color: '#F39C12', // Updated color to match ScanPage
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#34495E',
    borderRadius: 10,
  },
  summary: {
    color: '#FFFFFF',
    fontSize: 16,
    padding: 10,
    backgroundColor: '#34495E',
    borderRadius: 10,
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DocumentDetailPage;
