import { initializeApp } from 'firebase/app';
import 'firebase/firestore'
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCmy0wNPonKY6qJFqWR185LDeKtrTXNo2o",
  authDomain: "fayzzloh.firebaseapp.com",
  projectId: "fayzzloh",
  storageBucket: "fayzzloh.appspot.com",
  messagingSenderId: "856980578437",
  appId: "1:856980578437:web:ac7ae176b57cd1ba84c9ec"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;