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

  async addExpenses(amount, details, peopleInvolved, success) {
    // Format people involved
    const formattedPeopleInvolved = peopleInvolved.map((person) => ({
      name: person.name || "", // Ensure fields are not undefined
      percentage: person.percentage || 0, // Default to 0 if undefined
      phoneNumber: person.phoneNumber || "", // Default to empty string if undefined
    }));

    // Calculate amount per person
    const amountPerPerson = parseFloat(amount) / formattedPeopleInvolved.length;

    try {
      // Debugging: Log the data being used
      console.log("Formatted People Involved:", formattedPeopleInvolved);
      console.log("Amount Per Person:", amountPerPerson);

      // Process each person asynchronously
      const promises = formattedPeopleInvolved.map(async (each) => {
        let phoneNumber = each.phoneNumber
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "");

        if (phoneNumber.startsWith("+61")) {
          phoneNumber = phoneNumber.slice(3);
          if (!phoneNumber.startsWith("0")) {
            phoneNumber = "0" + phoneNumber;
          }
        }

        // Debugging: Log the phone number being used
        console.log("Phone Number:", phoneNumber);

        // Add document to 'pay' subcollection
        await addDoc(collection(this.db, "Users", phoneNumber, "pay"), {
          details: details || "", // Default to empty string if undefined
          amount: amountPerPerson || 0, // Default to 0 if undefined
          peopleInvolved: formattedPeopleInvolved,
        });
      });

      // Add document to 'receive' collection for a specific user
      await addDoc(collection(this.db, "Users", "0412524317", "receive"), {
        details: details || "", // Default to empty string if undefined
        amount: amount || 0, // Default to 0 if undefined
        peopleInvolved: formattedPeopleInvolved,
      });

      // Wait for all promises to complete
      await Promise.all(promises);

      // All operations succeeded
      success(true);
    } catch (error) {
      console.error("Error adding documents: ", error);
      success(false);
    }
  }

  // Method to see all transactions of a user
  async seeAllReceivingTransaction() {
    try {
      const dbRef = await getDocs(
        collection(this.db, "Users", "0412524317", "receive")
      );
      dbRef.forEach((doc) => {
        const transaction = new Transaction(
          doc.data().amount,
          doc.data().otherUsers,
          doc.data().timeStamp,
          doc.data().status,
          doc.id,
          doc.data().details
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
        collection(this.db, "Users", "0412524317", "pay")
      );
      dbRef.forEach((doc) => {
        const transaction = new Transaction(
          doc.data().amount,
          doc.data().otherUsers,
          doc.data().timeStamp,
          doc.data().status,
          doc.id,
          doc.data().details
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

  // remove transaction
  async removeTransaction(type, id, success) {
    try {
      const docRef = doc(this.db, "Users", "iampranish@Outlook.com", type, id);
      await deleteDoc(docRef);
      success(true);
    } catch (error) {
      console.log(error);
    }
  }

  // update amount
  async updateAmount(id, newAmount, success) {
    try {
      const dbRef = doc(
        this.db,
        "Users",
        "iampranish@Outlook.com",
        "receive",
        id
      );
      await updateDoc(dbRef, {
        amount: newAmount,
      });
      success(true);
    } catch (error) {
      success(false);
      console.log(error);
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
