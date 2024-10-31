import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export const uploadImageToStorage = async (uri: string): Promise<string> => {
  const storage = getStorage();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `images/${user.uid}/${Date.now()}.jpg`);

  try {
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('File available at', downloadURL);
    return downloadURL; // Return the download URL for further use
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
