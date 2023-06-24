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
import * as firebase from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updateEmail } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

/* 🦊 Firebase Variables Initial Config : 🦊 */
const firebaseConfig = {
  apiKey: "AIzaSyC9xkiO8fFVUjJBaB3UsHnUWmq_P5xi8Gk",
  authDomain: "ardix-group-2.firebaseapp.com",
  projectId: "ardix-group-2",
  storageBucket: "ardix-group-2.appspot.com",
  messagingSenderId: "991834990652",
  appId: "1:991834990652:web:59f26ada6a7a9d3c72fb39",
  measurementId: "G-FJ1PVJ65YL"
};

const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage();
const auth = getAuth();
export default app;

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
  alert("Tout est bon : ta photo a bien été enregistrée ! 👋");
  window.location.reload();
}

/* 🙏 Update a new name : 🙏 */
export function updateDisplayName(newDisplayName) {
  updateProfile(auth.currentUser, {
    displayName: newDisplayName
  }).then(() => {
    alert("Your display name is updated ! ✔");
    window.location.reload();
  }).catch((error) => {
    console.log(error);
  });
}

/* 📬 Update a new email : 📬 */
export function updateUserEmail(newEmail) {
  updateEmail(auth.currentUser, newEmail).then(() => {
    alert("Your email is updated ! ✔");
    window.location.reload();
  }).catch((error) => {
    console.log(error);
  });
}