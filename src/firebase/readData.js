import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "./firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
async function readData(id) {
  const docSnap = await getDoc(doc(db, "data", id));
  const pathReference = ref(storage, `image/${id}`);
  const imageurls=await getDownloadURL(pathReference)
  const pathReferenceresume = ref(storage, `resume/${id}`);
  const resumeurls=await getDownloadURL(pathReferenceresume)
  if (docSnap.exists()) {
    return [docSnap.data(),imageurls,resumeurls];
  }
  else {
    return null;
  }
}

export default readData;
