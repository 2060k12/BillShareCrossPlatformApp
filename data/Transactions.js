import { Timestamp } from "firebase/firestore/lite";

class Transaction {
  constructor(amount, otherUsers, timeStamp, status, id) {
    this.amount = amount;
    this.otherUsers = otherUsers;
    this.timeStamp = timeStamp;
    this.status = status;
    this.id = id;
  }
}

export default Transaction;
