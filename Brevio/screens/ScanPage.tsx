import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firestore } from '../config/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Config from 'react-native-config';
import { getAuth } from 'firebase/auth';
import { uploadImageToStorage } from '../services/ImageUploadService'; // Import the service

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadPressed, setUploadPressed] = useState<boolean>(false); // State to track if upload button has been pressed
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false); // State to track if analyzing is in progress
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false); // State to track if summarizing is in progress

  const apiKey = '';
  const openAIKey = '';

  const analyzeImage = async () => {
    try {
      setIsAnalyzing(true); // Set to true when the analyze process starts
      setIsLoading(true);
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
      console.log('API Response:', apiResponse.data);

      const textAnnotations = apiResponse.data.responses[0].textAnnotations || [];
      const words = textAnnotations.slice(1).map((text: any) => text.description).join(' ');
      setDescription(words);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error analyzing image:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false); // Reset the state after the analyze process
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

  const summarizeText = async () => {
    try {
      setIsSummarizing(true); // Set to true when the summarize process starts
      setIsLoading(true);
      if (description) {
        const summary = await summarizeTextWithOpenAI(description);
        setSummarizedText(summary);
      } else {
        console.error('Description is empty');
      }
    } catch (error) {
      console.error('Error summarizing text:', error);
    } finally {
      setIsLoading(false);
      setIsSummarizing(false); // Reset the state after the summarize process
    }
  };

  const { width: screenWidth } = Dimensions.get('window');

  const uploadDataToFirestore = async (description: string, summarizedText: string, folderName: string, imageUrl: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('No user is currently logged in');
        return;
      }

      const brevioFilesCollection = collection(firestore, 'Brevio_files');

      await addDoc(brevioFilesCollection, {
        folderName,
        description,
        summarizedText,
        userId: user.uid,
        imageUrl,
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
      setUploadPressed(true); // Set to true when the upload process starts
      if (!folderName) {
        alert('Please enter a folder name');
        return;
      }

      if (!imageUri) {
        alert('No image selected for upload');
        return; // Exit if imageUri is null
      }
      const imageUrl = await uploadImageToStorage(imageUri); // Use the service to upload the image
      await uploadDataToFirestore(description, summarizedText, folderName, imageUrl); // Pass the image URL

      setModalVisible(false);
      // alert('Data has been successfully saved to Firestore!');

      setImageUri(null);
      setDescription('');
      setSummarizedText('');
      setFolderName('default-folder');
    } catch (error) {
      console.error('Error uploading data:', error);
    } finally {
      setUploadPressed(false); // Reset the state after the upload process
    }
  };

  const resetState = () => {
    setImageUri(null);
    setDescription('');
    setSummarizedText('');
    setFolderName('default-folder');
    setModalVisible(false);
  };

  const pickImage = async () => {
    // Implement the image picking logic here
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    // Implement the logic to take a picture using the camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan & Summarize</Text>
      </View>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={pickImage} style={styles.touchableButtonRow}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePicture} style={styles.touchableButtonRow}>
          <Text style={styles.buttonText}>Take a Picture</Text>
        </TouchableOpacity>
      </View>

      {imageUri && ( // Show buttons only if an image is selected
        <>
          <TouchableOpacity
            onPress={analyzeImage}
            style={[styles.touchableButtonBottom, isAnalyzing ? { backgroundColor: '#888' } : {}]} // Change background color if analyzing
            activeOpacity={isAnalyzing ? 0.5 : 0.7} // Change opacity when pressed
          >
            <Text style={styles.buttonText}>Analyze Image</Text>
          </TouchableOpacity>

          {description && (
            <TouchableOpacity
              onPress={summarizeText}
              style={[styles.touchableButtonBottom, isSummarizing ? { backgroundColor: '#888' } : {}]} // Change background color if summarizing
              activeOpacity={isSummarizing ? 0.5 : 0.7} // Change opacity when pressed
            >
              <Text style={styles.buttonText}>Summarize Text</Text>
            </TouchableOpacity>
          )}

          {(summarizedText || description) && ( // Show Upload Data and Reset buttons after summarization
            <>
              <TouchableOpacity
                onPress={handleDataAndUpload}
                style={[styles.touchableButtonBottom, uploadPressed ? { backgroundColor: '#888' } : {}]} // Change background color if pressed
                activeOpacity={uploadPressed ? 0.5 : 0.7} // Change opacity when pressed
              >
                <Text style={styles.buttonText}>Upload Data</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetState}
                style={[styles.touchableButtonBottom, uploadPressed ? { backgroundColor: '#888' } : {}]} // Change background color if pressed
                activeOpacity={uploadPressed ? 0.5 : 0.7} // Change opacity when pressed
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      {isLoading && (
        <ActivityIndicator size="large" color="#F39C12" style={{ marginVertical: 20 }} />
      )}

      {summarizedText && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{summarizedText}</Text>
        </View>
      )}

      {description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}

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
              style={styles.modalInput}
              placeholder="Folder Name"
              placeholderTextColor="#ccc"
              value={folderName}
              onChangeText={setFolderName}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={uploadData}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#34495E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 40,
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
  card: {
    backgroundColor: '#34495E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  touchableButtonRow: {
    backgroundColor: '#F39C12',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  touchableButtonBottom: {
    backgroundColor: '#F39C12',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  labelsContainer: {
    margin: 10,
  },
  labelText: {
    color: '#fff',
    fontSize: 16,
    margin: 5,
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
