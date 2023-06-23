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

import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../config/FirebaseConfig.js";

const firestore = getFirestore(app);

export default async function handler(req, res) {
  const snapshot = await getDocs(collection(firestore, "post"));

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.status(200).json(data);
}