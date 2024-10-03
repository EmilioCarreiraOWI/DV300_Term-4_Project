import Index from '@/app';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { callGoogleVisionApi } from '../config/googleVisionApi'; // Adjust the path as necessary

const ScanPage = () => {
  const [imageUri, setImageUri] = useState(null);
  const [text, setText] = useState('');
  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        console.log('Image response:', image);

        if (image.uri) {
          console.log('Image URI:', image.uri);
          setImageUri(image.uri);
          const base64Image = await RNFS.readFile(image.uri, 'base64');
          console.log('Base64 Image:', base64Image);
        } else {
          console.error('Image URI is undefined');
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {text && <Text style={styles.detectedText}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#F39C12',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  detectedText: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },
});

export default ScanPage;
