import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firestore } from '../config/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Config from 'react-native-config';

// Define the type for combinedAnnotations
interface AnnotationType {
    mid: string;
    description: string;
}

const ScanPage = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [summarizedText, setSummarizedText] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('default-folder');

  const apiKey = '';
  const openAIKey = '';

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

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert('No image selected');
        return;
      }

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
      const textAnnotations = apiResponse.data.responses[0].textAnnotations || [];

      // Extract only the words, ignoring labels
      const words = textAnnotations.slice(1).map((text: any) => text.description).join(' ');
      setDescription(words);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error analyzing image:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const summarizeTextWithOpenAI = async (text: string): Promise<string> => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIKey}`,
    };

    const maxTokens = Math.min(100, Math.floor(text.length / 5));

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes text briefly.',
        },
        { role: 'user', content: text },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    };

    try {
      console.log('Sending request to OpenAI:', JSON.stringify(data, null, 2)); // Log request data
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('OpenAI API response:', result);

      if (!result.choices || result.choices.length === 0) {
        throw new Error('No choices returned from OpenAI API');
      }

      return result.choices[0].message.content;
    } catch (error) {
      console.error('Error in summarizeTextWithOpenAI:', error);
      throw error;
    }
  };

  const handleSummarizeAndDisplay = async () => {
    try {
      const summary = await summarizeTextWithOpenAI(description);
      setSummarizedText(summary);
    } catch (error) {
      console.error('Error handling summarization:', error);
    }
  };

  const { width: screenWidth } = Dimensions.get('window');

  const uploadDataToFirestore = async (description: string, summarizedText: string, folderName: string) => {
    try {
      const brevioFilesCollection = collection(firestore, 'Brevio_files');

      await addDoc(brevioFilesCollection, {
        folderName,
        description,
        summarizedText,
        timestamp: new Date()
      });

      console.log('Data uploaded to Firestore successfully!');
    } catch (error) {
      console.error('Error uploading data to Firestore:', error);
    }
  };

  const handleDataAndUpload = async () => {
    try {
      setModalVisible(true);
    } catch (error) {
      console.error('Error handling data:', error);
    }
  };

  const uploadData = async () => {
    try {
      await uploadDataToFirestore(description, summarizedText, folderName);

      setModalVisible(false);
      alert('Data has been successfully saved to Firestore!');

      setImageUri(null);
      setDescription('');
      setSummarizedText('');
      setFolderName('default-folder');
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const analyzeAndSummarize = async () => {
    try {
      await analyzeImage();
      const summary = await summarizeTextWithOpenAI(description);
      setSummarizedText(summary);
    } catch (error) {
      console.error('Error in analyze and summarize:', error);
    }
  };

  const resetState = () => {
    setImageUri(null);
    setDescription('');
    setSummarizedText('');
    setFolderName('default-folder');
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Google Cloud Vision API</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={{ width: screenWidth, height: screenWidth, resizeMode: 'contain' }} />}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={pickImage} style={styles.touchableButtonRow}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePicture} style={styles.touchableButtonRow}>
          <Text style={styles.buttonText}>Take a Picture</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={analyzeAndSummarize} style={styles.touchableButtonBottom}>
        <Text style={styles.buttonText}>Analyze & Summarize</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDataAndUpload} style={styles.touchableButtonBottom}>
        <Text style={styles.buttonText}>Upload Data</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetState} style={styles.touchableButtonBottom}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter Folder Name</Text>
            <TextInput
              style={[styles.input, styles.modalInput]}
              onChangeText={setFolderName}
              value={folderName}
              placeholder="Folder Name"
              placeholderTextColor="#888"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.signUpButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signInButton} onPress={uploadData}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {
        summarizedText && (
          <View style={styles.summaryContainer}>
            <Text>Summarized Text:</Text>
            <Text style={styles.summaryText}>{summarizedText}</Text>
          </View>
        )
      }
      {
        description && (
          <View style={styles.labelsContainer}>
            <Text>Detected Words:</Text>
            <Text style={styles.labelText}>
              {description}
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchableButtonRow: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F39C12',
    width: '48%',
    marginBottom: 20,
  },
  touchableButtonBottom: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F39C12',
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    padding: 20,
    backgroundColor: '#2C3E50',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#F39C12',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#34495E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  signUpButton: {
    backgroundColor: '#34495E',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#F39C12',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  title: {
    color: '#F39C12',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ScanPage;
