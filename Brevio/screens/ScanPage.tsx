import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Or define the Label type if it's not imported
type Label = {
  mid: string;
  description: string;
};

// Define the type for combinedAnnotations
interface AnnotationType {
    mid: string; // or the appropriate type
    description: string;
    // ... other properties
}

const ScanPage = () => {

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [labels, setLabels] = useState<AnnotationType[]>([]);
  const [summarizedText, setSummarizedText] = useState<string>('');

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

      const apiKey = 'AIzaSyBLwVFMz25PTng-_XHwN8vTa1d9JePbDzk';
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
                type: 'DOCUMENT_TEXT_DETECTION',
              },
            ],
          },
        ],
      };

      const apiResponse = await axios.post(url, requestData);
      const labelAnnotations = apiResponse.data.responses[0].labelAnnotations || [];
      const textAnnotations = apiResponse.data.responses[0].textAnnotations || [];

      // Combine labels and text into a single array
      const combinedAnnotations: AnnotationType[] = [
        ...labelAnnotations.map((label: Label) => ({
          mid: label.mid,
          description: label.description,
        })),
        ...textAnnotations.map((text: any, index: number) => ({
          mid: `text-${index}`,
          description: text.description,
        })),
      ];

      setLabels(combinedAnnotations as AnnotationType[]);

      // Summarize the text descriptions
      const textDescriptions = textAnnotations.map((text: any) => text.description);
      const summary = summarizeText(textDescriptions);
      setSummarizedText(summary);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error analyzing image:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const summarizeText = (descriptions: string[]): string => {
    // Simple summarization logic (e.g., join first few words)
    return descriptions.slice(0, 5).join(' '); // Adjust as needed
  };

  const { width: screenWidth } = Dimensions.get('window');

  return (
    // temporary
    <ScrollView contentContainerStyle={styles.container}>
      
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

      {imageUri && <Image source={{ uri: imageUri }} style={{ width: screenWidth, height: screenWidth, resizeMode: 'contain' }} />}

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text>Pick an image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={analyzeImage} style={styles.button}>
        <Text>Analyze image</Text>
      </TouchableOpacity>
      {
        summarizedText && (
          <View style={styles.summaryContainer}>
            <Text>Summarized Text:</Text>
            <Text style={styles.summaryText}>{summarizedText}</Text>
          </View>
        )
      }
      {
        labels.length > 0 && (
          <View style={styles.labelsContainer}>
            <Text>Normal Text:</Text>
            <Text style={styles.labelText}>
              <Text>{labels.map(label => label.description).join(' ')}</Text>
            </Text>
          </View>
        )
      }

      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2C3E50',
    padding: 10,
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
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
  },
  scanOverlay: {
    position: 'absolute',
    width: '100%',
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
  labelsContainer: {
    margin: 10,
  },
  labelText: {
    color: '#fff',
    fontSize: 16,
    margin: 5,
  },
  summaryContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#34495E',
    borderRadius: 5,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ScanPage;
