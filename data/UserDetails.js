class User {
  constructor(id, name, email, phoneNumber, imageUrl) {
    (this.name = name),
      (this.email = email),
      (this.phoneNumber = phoneNumber),
      (this.imageUrl = imageUrl),
      (this.id = id);
  }
}

export default User;

export class PeopleInvolved {
  constructor(name, percentage, phoneNumber) {
    (this.name = name),
      (this.percentage = percentage),
      (this.phoneNumber = phoneNumber);
  }
}
