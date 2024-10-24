import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

interface Folder {
  name: string;
  imageUrl: string;
}

const FilePage = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const storage = getStorage();
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const storageRef = ref(storage, ''); // Root reference
        const result = await listAll(storageRef);
        const folderPromises = result.prefixes.map(async (folderRef) => {
          const imagesResult = await listAll(folderRef);
          const imageUrl = imagesResult.items.length > 0
            ? await getDownloadURL(imagesResult.items[0]) // Get the first image URL
            : '';
          return { name: folderRef.name, imageUrl };
        });

        const folderData = await Promise.all(folderPromises);
        setFolders(folderData);
      } catch (error) {
        console.error('Error fetching folders: ', error);
      }
    };

    fetchFolders();
  }, []);

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
      <Text style={styles.header}>Folders</Text>
      <View style={styles.folderContainer}>
        {folders.map((folder, index) => (
          <TouchableOpacity key={index} style={styles.folderButton}>
            {folder.imageUrl ? (
              <Image source={{ uri: folder.imageUrl }} style={styles.folderImage} />
            ) : (
              <Text style={styles.noImageText}>No Image</Text>
            )}
            <Text style={styles.folderText}>{folder.name}</Text>
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
  folderContainer: {
    marginHorizontal: 20,
  },
  folderButton: {
    backgroundColor: '#34495E',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  folderImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  noImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  folderText: {
    color: '#FFFFFF',
    fontSize: 18,
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
