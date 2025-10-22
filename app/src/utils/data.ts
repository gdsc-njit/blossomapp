import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";

export interface Tree {
  id: string; // in future should be random hash but in practice mostly integers, NOT EDITABLE
  x: number;  // floating point
  y: number;  // floating point
  name: string;  // any string
  description: string;  // any string
  date: string;  // nice datestring mm/dd
  zone: string;  // string
  diameter: string; // small, medium, large, extra large
  length: string; // small, medium, large, extra large
  image: string; // URI
}

export async function fetchAllTrees(): Promise<Tree[]> {
  try {
    const snapshot = await getDocs(collection(db, "trees"));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        x: parseFloat(data.x) || 0,
        y: parseFloat(data.y) || 0,
        name: data.name || '',
        description: data.description || '',
        date: data.date || '',
        zone: data.zone || '',
        diameter: data.diameter || '',
        length: data.length || '',
        image: data.image || '',
      } as Tree;
    });
  } catch (error) {
    console.error("Error fetching trees:", error);
    throw error;
  }
}

export async function fetchTreeById(id: string): Promise<Tree | null> {
  try {
    const snapshot = await getDocs(query(collection(db, "trees"), where("__name__", "==", id)));
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        x: parseFloat(data.x) || 0,
        y: parseFloat(data.y) || 0,
        name: data.name || '',
        description: data.description || '',
        date: data.date || '',
        zone: data.zone || '',
        diameter: data.diameter || '',
        length: data.length || '',
        image: data.image || '',
      } as Tree;
    }
    return null;
  } catch (error) {
    console.error("Error fetching tree:", error);
    throw error;
  }
}

export async function addTree(tree: Omit<Tree, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "trees"), tree);
    return docRef.id;
  } catch (error) {
    console.error("Error adding tree:", error);
    throw error;
  }
}

export async function updateTree(id: string, updates: Partial<Tree>): Promise<void> {
  try {
    const treeRef = doc(db, "trees", id);
    await updateDoc(treeRef, updates);
  } catch (error) {
    console.error("Error updating tree:", error);
    throw error;
  }
}

export async function deleteTree(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "trees", id));
  } catch (error) {
    console.error("Error deleting tree:", error);
    throw error;
  }
}

export async function exportData(data: Tree[]): Promise<void> {
  try {
    console.log("Exporting data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
}
