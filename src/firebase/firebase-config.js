// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW39RmQekzjJHpyoNs0Nm5GMgSNrXc2wc",
  authDomain: "app-carros-4da20.firebaseapp.com",
  projectId: "app-carros-4da20",
  storageBucket: "app-carros-4da20.appspot.com",
  messagingSenderId: "450636039435",
  appId: "1:450636039435:web:32dc983e3bef7dbda8ce0e",
  measurementId: "G-8MQ925G08B"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export{app, db,analytics}

