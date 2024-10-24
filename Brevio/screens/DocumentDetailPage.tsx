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
      <Text style={styles.description}>{document.description}</Text>
      <Text style={styles.summary}>{document.summarizedText}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  summary: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default DocumentDetailPage;
