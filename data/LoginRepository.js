import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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
      await createUserWithEmailAndPassword(this.auth, email, password).then(
        async (userCredential) => {
          // Signed up
          const dbRef = await addDoc(collection(this.db, "Users"), {
            name: name,
            phoneNumber: phoneNumber,
            email: email,
          });
          const user = userCredential.user;
          result(true);
        }
      );
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error [${errorCode}]: ${errorMessage}`);
      result(false);
    }
  }
}

export default LoginRepository;
