import { doc, getDoc, setDoc, updateDoc, increment} from "firebase/firestore";
import { db } from "@/lib/firebase";

const saveUser = async ({email, name, imageUrl}) => {
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newUser = new User(name,email, imageUrl, new Date().toISOString(), 1)
        await setDoc(userRef, newUser.toJSON());
    } else {
        await updateDoc(userRef, {
        visitCount: increment(1),
        });
    }
}

export default saveUser;