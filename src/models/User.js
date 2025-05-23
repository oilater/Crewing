class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    static fromFirestore(doc) {
        const data = doc.data();
        return new User(data.name, data.age);
  }
}

export default User;