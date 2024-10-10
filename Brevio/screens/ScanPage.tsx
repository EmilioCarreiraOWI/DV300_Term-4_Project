import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Or define the Label type if it's not imported
type Label = {
  mid: string;
  description: string;
};

const ScanPage = () => {

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [labels, setLabels] = useState([]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert('No image selected');
        return;
      }

      const apiKey = '14f88c6a8428c0e2329ab4176548b3e2cd96e5a4';
      const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestData = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 5,
              },
            ],
          },
        ],
      };
      const apiResponse = await axios.post(url, requestData);
      const labels = apiResponse.data.responses[0].labelAnnotations;
      setLabels(labels);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  return (
    // temporary
    <View style={styles.container}>
      
      {/* <View style={styles.scanContainer}>
        <Text style={styles.logo}>Brevio</Text>
        <View style={styles.scanOverlay}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      </View> */}

      <Text>Google cloud vision API</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.scanImage} />}

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text>Pick an image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={analyzeImage} style={styles.button}>
        <Text>Analyze image</Text>
      </TouchableOpacity>

      {
        labels.length > 0 && (
          <View>
            <Text>Labels:</Text>
            {labels.map((label: Label) => (
              <Text key={label.mid} style={styles.labelText}>{label.description}</Text>
            ))}
          </View>
        )
      }
      
      
    </View>
  );
};

const styles = StyleSheet.create({
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
    resizeMode: 'contain',
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
  button: {
    backgroundColor: '#F39C12',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  labelText: {
    color: '#fff',
    fontSize: 16,
    margin: 5,
  },
});

export default ScanPage;
