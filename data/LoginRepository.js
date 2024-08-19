import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

class LoginRepository {
  constructor() {
    // Initialize Firebase app
    this.app = initializeApp(firebaseConfig);

    // Initialize Firestore and Auth
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  async register(name, phoneNumber, email, password, result) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: phoneNumber, // Update display name with the actual name
        });

        console.log("Display name updated successfully!");
      }

      // Signed up, now save the user information in Firestore
      const dbRef = await setDoc(
        doc(this.db, "Users", phoneNumber), // Correct way to reference a specific document
        {
          name: name,
          phoneNumber: phoneNumber,
          email: email,
        }
      );
      // User created successfully, pass true to the result callback
      result(true);
    } catch (error) {
      // Handle errors during sign-up or Firestore operations
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error [${errorCode}]: ${errorMessage}`);

      // Pass false to the result callback
      result(false);
    }
  }
}

export default LoginRepository;
