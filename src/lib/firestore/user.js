import { doc, getDoc, setDoc, updateDoc, increment} from "firebase/firestore";
import { db } from "@/lib/firebase";
import User from "../../models/User";

/** Firestore의 users 콜렉션에 로그인한 유저 저장 */
const saveUser = async ({email, name, imageUrl}) => {
    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const data = { email, name, imageUrl};
        const newUser = new User(data);
        await setDoc(userRef, newUser.toJSON());
    } else {
        await updateDoc(userRef, {
        visitCount: increment(1),
        });
    }
}

export default saveUser;