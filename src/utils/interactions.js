import { storage, auth, database, fireTime } from "../Data/Firebase";
import {
    doc,
    setDoc,
    addDoc,
    updateDoc,
    getDoc,
    collection,
    Timestamp,
} from "firebase/firestore";
import moment from "moment-timezone";

export const registerInteraccion = async (userId, postId, Type, comment = null) => {
    const response = { status: null, error: null }
    const interactions = { 0: "Like", 1: "Comment" }
    try {
        const interacctionRef = collection(database, "Interacciones");

        await addDoc(interacctionRef, {
            userId: userId,
            postId: postId,
            Type: interactions[Type],
            Comment: comment
        }).then(() => response.status = true)
    } catch (error) {
        response.status = false;
        response.error = error
    }
}