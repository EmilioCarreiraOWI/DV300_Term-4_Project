// import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import RNFS from 'react-native-fs';
// import { callGoogleVisionApi } from '../config/googleVisionApi';

const ScanPage = () => {
  // const [imageUri, setImageUri] = useState<string | null>(null);
  // const [text, setText] = useState('');
  

  // const handleImagePick = () => {
  //   launchImageLibrary({ mediaType: 'photo' }, async (response) => {
  //     if (response.assets && response.assets.length > 0) {
  //       const image = response.assets[0];
  //       console.log('Image response:', image);

  //       if (image.uri) {
  //         console.log('Image URI:', image.uri);
  //         setImageUri(image.uri);
  //         const base64Image = await RNFS.readFile(image.uri, 'base64');
  //         console.log('Base64 Image:', base64Image);
  //         const detectedText = await callGoogleVisionApi(base64Image);
  //         setText(detectedText);
  //       } else {
  //         console.error('Image URI is undefined');
  //       }
  //     }
  //   });
  // };

  return (
    // temporary
    <View style={styles.container}>
      
      <View style={styles.scanContainer}>
        <Text style={styles.logo}>Brevio</Text>
        <View style={styles.scanOverlay}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      </View>
    </View>

// <View style={styles.container}>
    //   <TouchableOpacity onPress={handleImagePick}>
    //     <Text style={styles.buttonText}>Pick an Image</Text>
    //   </TouchableOpacity>
    //   {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    //   {text && <Text style={styles.detectedText}>{text}</Text>}
    // </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // buttonText: {
  //   color: '#F39C12',
  //   fontSize: 20,
  //   textAlign: 'center',
  //   marginTop: 20,
  // },
  // image: {
  //   width: 200,
  //   height: 200,
  //   marginTop: 20,
  // },
  // detectedText: {
  //   marginTop: 20,
  //   fontSize: 16,
  //   color: '#000',
  // },

  // termporary
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
