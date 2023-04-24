
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'; 
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {

  apiKey: "AIzaSyDHUfoFPadaQ_JYSBH-FpULaXRAXRa0Sk4",

  authDomain: "due-v4.firebaseapp.com",

  projectId: "due-v4",

  storageBucket: "due-v4.appspot.com",

  messagingSenderId: "329587889671",

  appId: "1:329587889671:web:5403304dee7f41db303ca2"

};



const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); 
export const auth = getAuth(app); 
export const GoogleAuth = new GoogleAuthProvider(); 