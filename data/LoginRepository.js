import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

class LoginRepository {
  constructor() {
    // Initialize Firebase app
    this.app = initializeApp(firebaseConfig);

    // Initialize Firestore and Auth
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  async register(email, password, result) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password).then(
        (userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user.email);
          result(true);
          // ...
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
