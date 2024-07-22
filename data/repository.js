import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import Transaction from "./Transactions";
class Repository {
  constructor() {
    // Initialize Firebase app
    this.app = initializeApp(firebaseConfig);

    // Initialize Firestore and Auth
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.currentUser = this.auth.currentUser;

    //  array which will hold both receiving and paying transactions of current user
    this.arrayOfReceivingTransactions = [];
    this.arrayOfPayingTransactions = [];
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

  // Method to see all transactions of a user
  async seeAllReceivingTransaction() {
    try {
      const dbRef = await getDocs(
        collection(this.db, "Users", "iampranish@Outlook.com", "receive")
      );
      dbRef.forEach((doc) => {
        const transaction = new Transaction(
          doc.data().amount,
          doc.data().otherUsers,
          doc.data().timeStamp,
          doc.data().status,
          doc.id
        );

        this.arrayOfReceivingTransactions.push(transaction);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Method to see all transactions of a user
  async seeAllPayingTransaction() {
    try {
      const dbRef = await getDocs(
        collection(this.db, "Users", "iampranish@Outlook.com", "pay")
      );
      dbRef.forEach((doc) => {
        const transaction = new Transaction(
          doc.data().amount,
          doc.data().otherUsers,
          doc.data().timeStamp,
          doc.data().status,
          doc.id
        );

        this.arrayOfPayingTransactions.push(transaction);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // function to get all users
  async getAllUsers() {
    try {
      const tempArr = [];
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        const user = new User(
          doc.id,
          doc.data().name,
          doc.data().email,
          doc.data().phoneNumber,
          doc.data().imageUrl
        );
        tempArr.push(user);
        console.log(doc.data());
      });
      setArrayOfUsers(tempArr);
    } catch (error) {
      console.log(error);
    }
  }
}

export default Repository;
