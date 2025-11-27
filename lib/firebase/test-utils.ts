import { getAdminFirestore } from './admin';

// Seed the emulated Firestore with test data
export async function seedFirestore(data: { [collection: string]: { [doc: string]: any }[] }) {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  for (const collectionName in data) {
    const collectionRef = db.collection(collectionName);
    const docs = data[collectionName];
    for (const docData of docs) {
      await collectionRef.doc(docData.id).set(docData);
    }
  }
}

// Clear all data from the emulated Firestore
export async function clearFirestore() {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  const collections = await db.listCollections();
  for (const collection of collections) {
    const docs = await collection.get();
    for (const doc of docs.docs) {
      await doc.ref.delete();
    }
  }
}
