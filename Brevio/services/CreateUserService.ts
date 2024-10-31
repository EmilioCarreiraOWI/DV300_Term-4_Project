import { firestore } from '../config/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const addUserToFirestore = async (userId: string, name: string, surname: string, email: string) => {
  try {
    const docRef = doc(firestore, 'users', userId);
    await setDoc(docRef, {
      name,
      surname,
      email,
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", userId);
    return { success: true };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
}; 