import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, TextInput, Modal, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { PDFDocument, rgb } from 'pdf-lib';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../config/FirebaseConfig';
import RNFetchBlob from 'rn-fetch-blob';

// Or define the Label type if it's not imported
type Label = {
  mid: string;
  description: string;
};

// Define the type for combinedAnnotations
interface AnnotationType {
    mid: string;
    description: string;
}

const ScanPage = () => {

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [labels, setLabels] = useState<AnnotationType[]>([]);
  const [summarizedText, setSummarizedText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('default-folder');

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
      const textAnnotations = apiResponse.data.responses[0].textAnnotations || [];

      // Extract only the words from the text annotations
      const words = textAnnotations.map((text: any) => text.description).join(' ');
      setLabels([{ mid: '', description: words }]); // Set the words as labels

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error analyzing image:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const summarizeTextWithAPI = async (text: string): Promise<string> => {
    try {
      const response = await axios.post('YOUR_SUMMARIZATION_API_URL', {
        text: text,
        // Add any required parameters for the API
      });
      return response.data.summary; // Adjust based on the API's response structure
    } catch (error) {
      console.error('Error summarizing text:', error);
      return 'Error summarizing text';
    }
  };

  const { width: screenWidth } = Dimensions.get('window');

  const convertToPDF = async () => {
    try {
      if (!imageUri) {
        alert('No image selected');
        return;
      }

      // Fetch the image as a base64 string
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert the base64 string to a Uint8Array
      const imageUint8Array = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Determine the image format and embed it
      let image;
      if (imageUri.endsWith('.png')) {
        image = await pdfDoc.embedPng(imageUint8Array);
      } else if (imageUri.endsWith('.jpg') || imageUri.endsWith('.jpeg')) {
        image = await pdfDoc.embedJpg(imageUint8Array);
      } else {
        throw new Error('Unsupported image format');
      }

      // Get the dimensions of the image
      const { width, height } = image.scale(1);

      // Add a page to the document
      const page = pdfDoc.addPage([width, height]);

      // Draw the image onto the page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });

      // Serialize the PDFDocument to bytes
      const pdfBytes = await pdfDoc.save();

      // Use RNFetchBlob to handle the binary data
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      // Create a reference to the PDF file in Firebase Storage
      const pdfRef = ref(storage, 'scannedImage.pdf');
      // Upload the PDF file
      await uploadBytes(pdfRef, pdfBlob);

      // alert('PDF uploaded to Firebase Storage successfully!');
    } catch (error) {
      console.error('Error converting to PDF:', error);
    }
  };

  const uploadDataToFirebase = async (data: any, folderName: string, fileName: string) => {
    try {
      // Convert data to a Blob if necessary
      const blob = new Blob([data], { type: 'application/octet-stream' });

      // Create a reference to the file in a specific folder in Firebase Storage
      const fileRef = ref(storage, `${folderName}/${fileName}`);

      // Upload the file
      await uploadBytes(fileRef, blob);

      // alert(`${fileName} uploaded to Firebase Storage successfully in folder ${folderName}!`);
    } catch (error) {
      console.error('Error uploading data to Firebase:', error);
    }
  };

  const handleDataAndUpload = async () => {
    try {
      setModalVisible(true); // Show the modal to get folder name
    } catch (error) {
      console.error('Error handling data:', error);
    }
  };

  const uploadData = async () => {
    try {
      // Example: Convert labels to JSON and upload
      const labelsJson = JSON.stringify(labels);
      await uploadDataToFirebase(labelsJson, folderName, 'labels.json');

      // Example: Convert summarized text to a Blob and upload
      await uploadDataToFirebase(summarizedText, folderName, 'summary.txt');

      setModalVisible(false); // Hide the modal after upload
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  return (
    // temporary
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

      <TouchableOpacity onPress={analyzeImage} style={styles.touchableButtonBottom}>
        <Text style={styles.buttonText}>Analyze Image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={convertToPDF} style={styles.touchableButtonBottom}>
        <Text style={styles.buttonText}>Convert to PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDataAndUpload} style={styles.touchableButtonBottom}>
        <Text style={styles.buttonText}>Upload Data</Text>
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
        labels.length > 0 && (
          <View style={styles.labelsContainer}>
            <Text>Detected Words:</Text>
            <Text style={styles.labelText}>
              {labels.map(label => label.description).join(' ')}
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
  // Reuse signUpButton and signInButton styles from LoginPage
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
