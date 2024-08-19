import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  deleteDoc,
  addDoc,
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Transaction,
  InvolvedPerson,
  DetailTransaction,
} from "../data/Transactions";
import { ca } from "date-fns/locale";
import { add } from "date-fns";
class Repository {
  constructor(auth) {
    // Initialize Firebase app
    this.app = initializeApp(firebaseConfig);

    // Initialize Firestore and Auth
    this.db = getFirestore(this.app);
    this.auth = auth || getAuth(this.app);

    this.storage = getStorage(this.app);
    this.currentUser = this.auth.currentUser;

    //  array which will hold both receiving and paying transactions of current user
    this.listOfTransactions = [];
    this.listOfSettledTransactions = [];
  }

  formatPhoneNumber(user) {
    let phone = user.toString().trim();

    // Remove all spaces
    phone = phone.replace(/\s+/g, "");

    // Replace +61 with 0
    if (phone.startsWith("+61")) {
      phone = phone.replace("+61", "0");
    }

    // Ensure the phone number starts with 0
    if (!phone.startsWith("0")) {
      phone = "0" + phone;
    }

    return phone;
  }

  // Method to add expenses
  async addExpense(expenseData, success) {
    try {
      const dbRef = await addDoc(collection(this.db, "expenses"), {
        amount: expenseData.amount,
        details: expenseData.details,
        involvedPeople: expenseData.involvedPeople,
        payedBy: arrayUnion(this.auth.currentUser.displayName),
      });
      console.log(dbRef.id);

      // add this in the transaction of the user
      for (let i = 0; i < expenseData.involvedPeople.length; i++) {
        const user = expenseData.involvedPeople[i];

        const userDocRef = doc(
          this.db,
          "Users",
          this.formatPhoneNumber(user.phoneNumber),
          "transactions",
          dbRef.id
        );

        if (user.phoneNumber === this.auth.currentUser.displayName) {
          await setDoc(userDocRef, {
            totalAmount: expenseData.amount,
            amount: (expenseData.amount * user.percentage) / 100,
            timeStamp: new Date(),
            status: "receive",
            details: expenseData.details,
            addedBy: this.auth.currentUser.displayName,
          });
        } else {
          await setDoc(userDocRef, {
            totalAmount: expenseData.amount,
            amount: (expenseData.amount * user.percentage) / 100,
            timeStamp: new Date(),
            status: "pay",
            details: expenseData.details,
            addedBy: this.auth.currentUser.displayName,
          });

          this.addNotificationToDatabase(
            this.formatPhoneNumber(user.phoneNumber),
            "New Expense",
            "New Expense Added",
            expenseData.amount,
            userDocRef.id
          );
        }
      }

      success(true);
    } catch (error) {
      console.log(error);
      success(false);
    }
  }

  // Method to get all settled transactions of a user
  async getSettledTransactions() {
    try {
      const dbRef = await getDocs(
        collection(
          this.db,
          "Users",
          this.auth.currentUser.displayName,
          "settledTransactions"
        )
      );
      dbRef.forEach((doc) => {
        const transaction = new Transaction(
          doc.data().totalAmount,
          doc.data().timeStamp,
          doc.data().status,
          doc.id,
          doc.data().details,
          doc.data().addedBy
        );

        this.listOfSettledTransactions.push(transaction);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Method to see all transactions of a user
  async getAllTransactions() {
    try {
      const dbRef = await getDocs(
        collection(
          this.db,
          "Users",
          this.auth.currentUser.displayName,
          "transactions"
        )
      );
      dbRef.forEach((doc) => {
        const transaction = new Transaction(
          doc.data().totalAmount,
          doc.data().timeStamp,
          doc.data().status,
          doc.id,
          doc.data().details,
          doc.data().addedBy
        );

        this.listOfTransactions.push(transaction);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Method to get transaction details
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
              this.formatPhoneNumber(person.phoneNumber),
              person.percentage
            )
        );

        // Create an instance of DetailTransaction
        const detailTransaction = new DetailTransaction(
          data.amount,
          data.details,
          involvedPeople,
          data.payedBy
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
          this.formatPhoneNumber(doc.data().phoneNumber),
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

  // settle transactions
  async settleTransaction(id, involvedPeople, success) {
    involvedPeople.forEach((people) => {
      if (people.phoneNumber === this.auth.currentUser.displayName.toString()) {
        people.status = "payed";
      }
    });
    console.log(this.auth.currentUser.displayName);
    console.log("involvedPeople", involvedPeople);

    try {
      const dbRef = doc(
        this.db,
        "Users",
        this.auth.currentUser.displayName,
        "transactions",
        id
      );
      const newRef = doc(
        this.db,
        "Users",
        this.auth.currentUser.displayName,
        "settledTransactions",
        id
      );

      const dbRefData = await getDoc(dbRef);
      await setDoc(newRef, dbRefData.data());
      await deleteDoc(dbRef);

      const expensesRef = doc(this.db, "expenses", id);
      await updateDoc(expensesRef, {
        payedBy: arrayUnion(this.auth.currentUser.displayName),
      });

      success(true);
    } catch (error) {
      success(false);
      console.error("Error settling transaction:", error);
    }
  }

  // remove transaction
  async removeTransaction(amount, type, id, peoples, success) {
    try {
      console.log(amount);

      // people's phone into array to remove the transaction from their document
      names = peoples.map((person) => person.name);
      for (let i = 0; i < peoples.length; i++) {
        if (peoples[i].phoneNumber === this.auth.currentUser.displayName) {
          names.splice(i, 1);
        }
      }
      name = names.join(", ");

      peoples.forEach(async (person) => {
        const personRef = doc(
          this.db,
          "Users",
          this.formatPhoneNumber(person.phoneNumber),
          "transactions",
          id
        );
        await deleteDoc(personRef);

        this.addNotificationToDatabase(
          this.formatPhoneNumber(person.phoneNumber),
          name,
          "Transaction Deleted",
          amount ? amount : 0,
          ""
        );
      });

      const expensesRef = doc(this.db, "expenses", id);
      await deleteDoc(expensesRef);
      success(true);
    } catch (error) {
      console.log(error);
    }
  }

  // Update amount for a transaction
  async updateAmount(id, newAmount, success) {
    try {
      const dbRef = doc(
        this.db,
        "Users",
        this.auth.currentUser.displayName,
        "transactions",
        id
      );
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
      const dbRef = doc(
        this.db,
        "Users",
        this.auth.currentUser.displayName,
        "transactions",
        id
      );
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
      console.log("Logging out...");
      console.log(this.auth.currentUser);
      this.auth.signOut();
      success(true);
    } catch (error) {
      success(false);
      console.log(error);
    }
  }

  // add notification to the firestore database
  // Notification will be added inside the user's document
  // As a collection name "notification"
  async addNotificationToDatabase(id, title, body, amount, docId) {
    const dbRef = await addDoc(
      collection(this.db, "Users", id, "notification"),
      {
        title: title,
        body: body,
        amount: amount,
        timestamp: new Date(),
        docId: docId,
      }
    );
    console.log("Document written with ID: ", dbRef.id);
  }

  // get all notifications of a user

  async getNotifications(success) {
    try {
      const dbRef = collection(
        this.db,
        "Users",
        this.auth.currentUser.displayName,
        "notification"
      );
      const querySnapshot = await getDocs(dbRef);
      const tempArr = [];
      querySnapshot.forEach((doc) => {
        tempArr.push(doc.data());
      });
      success(tempArr);
    } catch (error) {
      console.log(error);
    }
  }

  // get uyser details
  async getUserDetails(userId) {
    const userDoc = await getDoc(doc(this.db, "Users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  }

  // upload profile of the user
  async uploadProfileImage(userId, imageUri) {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(this.storage, `profileImages/${userId}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  }

  // update user profile
  async updateUserProfile(userId, updates) {
    try {
      const docRef = doc(this.db, "Users", userId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  }

  // get current users
  async getCurrentUser() {
    try {
      // Get current user from Auth
      const currentUser = this.auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(
          this.db,
          "Users",
          this.auth.currentUser.displayName
        );

        // Fetch the document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
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

  // Update transactions
  async updateTransactions(
    id,
    amount,
    details,
    involvedPeople,
    initiallyInvolvedPeople,
    success
  ) {
    const peoples = involvedPeople.map((person) => ({
      name: person.name,
      percentage: person.percentage,
      phoneNumber: this.formatPhoneNumber(person.phoneNumber),
    }));

    const initialPeoples = initiallyInvolvedPeople.map(
      (person) => person.phoneNumber
    );

    try {
      initialPeoples.forEach(async (person) => {
        const userRef = doc(
          this.db,
          "Users",
          this.formatPhoneNumber(person),
          "transactions",
          id
        );

        await updateDoc(userRef, {
          totalAmount: amount,
          details: details,
        });
      });

      const expensesRef = doc(this.db, "expenses", id);

      await updateDoc(expensesRef, {
        amount: amount,
        details: details,
        involvedPeople: peoples,
      });

      initialPeoples.forEach(async (person) => {
        if (
          !peoples.find(
            (involvedPerson) => involvedPerson.phoneNumber === person
          )
        ) {
          const personRef = doc(this.db, "Users", person, "transactions", id);
          await deleteDoc(personRef);
        }
      });

      success(true);
    } catch (error) {
      success(false);
      console.error("Error updating transactions: ", error);
    }
  }
}

export default Repository;
