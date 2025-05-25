import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

interface UserType {
  socketId?: string;
  email?: string;
  name?: string;
  imageUrl?: string;
  visitCount?: number;
  createdAt?: string;
}

class User {
  socketId?: string;
  email?: string;
  name?: string;
  imageUrl?: string;
  visitCount?: number;
  createdAt?: string;

  constructor(data: UserType = {}) {
    this.socketId = data.socketId;
    this.email = data.email;
    this.name = data.name;
    this.imageUrl = data.imageUrl;
    this.visitCount = 1;
    this.createdAt = new Date().toISOString();
  }

  static fromFirestore(doc: QueryDocumentSnapshot<DocumentData>): User {
    const data = doc.data();
    return new User(data);
  }

  toJSON() {
    return {
      socketId: this.socketId,
      name: this.name,
      email: this.email,
      imageUrl: this.imageUrl,
      visitCount: this.visitCount,
      createdAt: this.createdAt,
    };
  }
}

export default User;