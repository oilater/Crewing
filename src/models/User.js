class User {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    static fromFirestore(doc) {
        const data = doc.data();    
        return new User(data);
    }
}

export default User;