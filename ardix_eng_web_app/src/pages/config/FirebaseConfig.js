/* 
       e                   888 ,e,                 e88~~\                                     
      d8b     888-~\  e88~\888  "  Y88b  /        d888     888-~\  e88~-_  888  888 888-~88e  
     /Y88b    888    d888  888 888  Y88b/         8888 __  888    d888   i 888  888 888  888b 
    /  Y88b   888    8888  888 888   Y88b         8888   | 888    8888   | 888  888 888  8888 
   /____Y88b  888    Y888  888 888   /Y88b        Y888   | 888    Y888   ' 888  888 888  888P 
  /      Y88b 888     "88_/888 888  /  Y88b        "88__/  888     "88_-~  "88_-888 888-_88"  
  📣 Version BETA - Xlator & SkyX [ID FR] - Copyright© 2023                         88   
.
*/

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

/* 🦊 Firebase Variables Initial Config : 🦊 */
const firebaseConfig = {
  apiKey: "AIzaSyAT6BA3pw_4BkMLXv9eFhGmESrxDCoilho",
  authDomain: "ardix-project.firebaseapp.com",
  projectId: "ardix-project",
  storageBucket: "ardix-project.appspot.com",
  messagingSenderId: "115388994394",
  appId: "1:115388994394:web:98c6da882e4660454bd963",
  measurementId: "G-SYYHL9D6YV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();

export function signup(email, password, name) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return updateProfile(user, { displayName: name });
    });
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function useAuth() {
  const [ currentUser, setCurrentUser ] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])
  return currentUser;
}

/* 📸 Upload a new profile picture : 📸 */
export async function upload(file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid, + '.png');
  setLoading(true);

  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  
  updateProfile(currentUser, {photoURL});
  setLoading(false);
  alert("C'est bon : la photo est bien envoyé !");
  window.location.reload();
}