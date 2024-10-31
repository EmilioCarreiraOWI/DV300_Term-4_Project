import { firestore } from '../config/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export const addUserToFirestore = async (userId: string, name: string, surname: string) => {
  try {
    const docRef = await addDoc(collection(firestore, 'users'), {
      userId,
      name,
      surname,
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
}; 