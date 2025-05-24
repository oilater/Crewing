import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

interface UserType {
  email?: string;
  name?: string;
  imageUrl?: string;
  visitCount?: number;
  createdAt?: string;
}

class User {
  email?: string;
  name?: string;
  imageUrl?: string;
  visitCount?: number;
  createdAt?: string;

  constructor(data: UserType = {}) {
    this.email = data.email;
    this.name = data.name;
    this.imageUrl = data.imageUrl;
    this.visitCount = data.visitCount;
    this.createdAt = new Date().toISOString();
  }

  static fromFirestore(doc: QueryDocumentSnapshot<DocumentData>): User {
    const data = doc.data();
    return new User(data);
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      visitCount: this.visitCount,
    };
  }
}

export default User;