import { Timestamp } from "firebase/firestore/lite";

// Class to represent a basic transaction
class Transaction {
  constructor(amount, timeStamp, status, id, details) {
    this.amount = amount;
    this.timeStamp = timeStamp; // Should be a Timestamp instance
    this.status = status;
    this.id = id;
    this.details = details;
  }
}

// Class to represent a person involved in the transaction
class InvolvedPerson {
  constructor(name, phoneNumber, percentage) {
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.percentage = percentage;
  }
}

// Class to represent detailed transaction information
class DetailTransaction {
  constructor(amount, details, involvedPeople) {
    this.amount = amount;
    this.details = details;
    this.involvedPeople = involvedPeople; // Array of InvolvedPerson instances
  }
}

export { Transaction, InvolvedPerson, DetailTransaction };
