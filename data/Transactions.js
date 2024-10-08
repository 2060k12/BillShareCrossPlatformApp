import { Timestamp } from "firebase/firestore/lite";

// Class to represent a basic transaction
class Transaction {
  constructor(totalAmount, timeStamp, status, id, details, addedBy) {
    this.totalAmount = totalAmount;
    this.timeStamp = timeStamp; // Should be a Timestamp instance
    this.status = status;
    this.id = id;
    this.details = details;
    this.addedBy = addedBy;
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
  constructor(amount, details, involvedPeople, payedBy) {
    this.amount = amount;
    this.details = details;
    this.involvedPeople = involvedPeople; // Array of InvolvedPerson instances
    this.payedBy = payedBy;
  }
}

export { Transaction, InvolvedPerson, DetailTransaction };
