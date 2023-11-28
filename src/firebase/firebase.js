import app from "./app";
import {Firestore, getFirestore,collection} from "firebase/firestore"
import { getStorage } from 'firebase/storage';
export const db = getFirestore(app);
export  const storage = getStorage(app);
