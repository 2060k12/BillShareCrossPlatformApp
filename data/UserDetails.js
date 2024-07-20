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
