import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, collection, setDoc } from "firebase/firestore";
class Repository {
  constructor() {
    // Initialize Firebase app
    this.app = initializeApp(firebaseConfig);

    // Initialize Firestore and Auth
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  // Method to add expenses
  async addExpenses(amount) {
    try {
      const dbRef = await setDoc(
        doc(this.db, "Users", "iampranish@Outlook.com"),
        {
          name: "Pranish Pathak",
          amount: amount,
        }
      );
      console.log("Document written with ID: ");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
}

export default Repository;
