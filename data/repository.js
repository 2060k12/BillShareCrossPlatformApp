import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { deleteDoc, addDoc, getFirestore } from "firebase/firestore";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  Transaction,
  InvolvedPerson,
  DetailTransaction,
} from "../data/Transactions";
class Repository {
  constructor() {
    // Initialize Firebase app
    this.app = initializeApp(firebaseConfig);

    // Initialize Firestore and Auth
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.currentUser = this.auth.currentUser;

    //  array which will hold both receiving and paying transactions of current user
    this.listOfTransactions = [];
  }

  // Method to add expenses
  async addExpense(expenseData, success) {
    try {
      const dbRef = await addDoc(collection(this.db, "expenses"), {
        amount: expenseData.amount,
        details: expenseData.details,
        involvedPeople: expenseData.involvedPeople,
      });
      console.log(dbRef.id);

      // add this in the transaction of the user
      for (let i = 0; i < expenseData.involvedPeople.length; i++) {
        const user = expenseData.involvedPeople[i];
        const userDocRef = doc(
          this.db,
          "Users",
          user.phoneNumber,
          "transactions",
          dbRef.id
        );

        if (user.phoneNumber === "0412524317") {
          await setDoc(userDocRef, {
            amount: expenseData.amount / expenseData.involvedPeople.length,
            timeStamp: new Date(),
            status: "receive",
            details: expenseData.details,
          });
        } else {
          await setDoc(userDocRef, {
            amount: expenseData.amount / expenseData.involvedPeople.length,
            timeStamp: new Date(),
            status: "pay",
            details: expenseData.details,
          });
        }
      }

      success(true);
    } catch (error) {
      console.log(error);
      success(false);
    }
  }

  // Method to see all transactions of a user
  async getAllTransactions() {
    try {
      const dbRef = await getDocs(
        collection(this.db, "Users", "0412524317", "transactions")
      );
      dbRef.forEach((doc) => {
        const transaction = new Transaction(
          doc.data().amount,
          doc.data().timeStamp,
          doc.data().status,
          doc.id,
          doc.data().details
        );

        this.listOfTransactions.push(transaction);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getTransactionDetails(id, success) {
    try {
      const dbRef = doc(this.db, "expenses", id);
      const docSnap = await getDoc(dbRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Create instances of InvolvedPerson
        const involvedPeople = data.involvedPeople.map(
          (person) =>
            new InvolvedPerson(
              person.name,
              person.phoneNumber,
              person.percentage
            )
        );

        // Create an instance of DetailTransaction
        const detailTransaction = new DetailTransaction(
          data.amount,
          data.details,
          involvedPeople
        );

        success(detailTransaction);
      } else {
        console.log("No such document!");
        success(null);
      }
    } catch (error) {
      console.log(error);
      success(null);
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

  // remove transaction
  async removeTransaction(type, id, success) {
    try {
      const docRef = doc(this.db, "Users", "0412524317", type, id);
      await deleteDoc(docRef);
      success(true);
    } catch (error) {
      console.log(error);
    }
  }

  // Update amount for a transaction
  async updateAmount(id, newAmount, success) {
    try {
      const dbRef = doc(this.db, "Users", "0412524317", "transactions", id);
      await updateDoc(dbRef, { amount: newAmount });

      const expensesRef = doc(this.db, "expenses", id);
      await updateDoc(expensesRef, { amount: newAmount });

      success(true);
    } catch (error) {
      success(false);
      console.error("Error updating amount:", error);
    }
  }
  // Update involved people for a transaction
  async updateInvolvedPeople(id, involvedPeople, success) {
    try {
      const dbRef = doc(this.db, "Users", "0412524317", "transactions", id);
      await updateDoc(dbRef, { involvedPeople });

      const expensesRef = doc(this.db, "expenses", id);
      await updateDoc(expensesRef, { involvedPeople });

      success(true);
    } catch (error) {
      success(false);
      console.error("Error updating involved people:", error);
    }
  }

  // logOut currentuser
  async logOut(success) {
    try {
      this.auth.signOut();
      success(true);
    } catch (error) {
      success(false);
      console.log(error);
    }
  }

  async getCurrentUser() {
    try {
      // Get current user from Auth
      const currentUser = this.auth.currentUser;

      if (currentUser) {
        // Reference to the user's document in Firestore
        const userDocRef = doc(this.db, "Users", "0412524317");

        // Fetch the document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Extract the phone field and name from the document
          const userData = userDoc.data();
          return {
            name: userData.name,
            phoneNumber: userData.phoneNumber,
          };
        } else {
          console.log("No such document!");
          return null;
        }
      } else {
        console.log("No current user!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  }
}

export default Repository;
