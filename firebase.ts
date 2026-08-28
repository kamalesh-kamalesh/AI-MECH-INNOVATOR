import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAzJp-rxnGZ_qvc6m4iEWORnpZvkvSRMh4",
  authDomain: "mech-b3384.firebaseapp.com",
  databaseURL: "https://mech-b3384-default-rtdb.firebaseio.com",
  projectId: "mech-b3384",
  storageBucket: "mech-b3384.firebasestorage.app",
  messagingSenderId: "660452483555",
  appId: "1:660452483555:web:1f736d9a55c25dd14900d6"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
