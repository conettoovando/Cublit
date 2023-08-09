import { storage, auth, database, fireTime } from "../Data/Firebase";
import { fileToLob } from "./helpers";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  collection,
  Timestamp,
  arrayUnion,
  arrayRemove,
  query,
  getDocs,
  where,
  orderBy,
} from "firebase/firestore";
import moment from "moment-timezone";
import { ProfileActivity } from "./Querys";

const fechaActual = moment().tz("America/Santiago");
export const uploadImage = async (image, path, name) => {
  const result = { status: false, error: null, url: null };
  const storageRef = ref(storage, path + "/" + name);
  const blob = await fileToLob(image);
  try {
    const snapshot = await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(ref(storage, path + "/" + name));
    result.status = true;
    result.url = url;
  } catch (error) {
    result.error = error;
  }
  return result;
};

export const updateProfilefun = async (data) => {
  const user = auth.currentUser;
  const result = { status: true, error: null };
  try {
    await updateProfile(user, {
      photoURL: data.photoURL,
    })
  } catch (error) {
    result.status = false;
    result.error = error;
  }
  return result;
};

export const updateFireData = async (dataName, DataInformation) => {
  const userRef = doc(database, dataName, DataInformation.uid);
  const response = { status: null, error: null };

  await updateDoc(userRef, DataInformation)
    .then(() => {
      response.status = true;
    })
    .catch((error) => {
      response.status = false;
      response.error = error;
    });
  return response;
};

export const createPostFireData = async (dataName, DataInformation) => {
  const userRef = doc(collection(database, dataName));
  const response = { status: null, error: null };
  const fecha = Timestamp.now().toDate();
  DataInformation.dateTime = fecha;
  await setDoc(userRef, DataInformation)
    .then(() => {
      response.status = true;
    })
    .catch((error) => {
      response.status = false;
      response.error = error;
    });
  return response;
};

export const getProfileData = async () => {
  const user = auth.currentUser;
  const userRef = doc(database, "users", user.uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  }
};

export const DelteImages = async (urls) => {
  const response = { status: null, error: null };

  if (urls.urlsPost.length > 0) {
    try {
      urls.urlsPost.map(async (url) => {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      });
      response.status = true;
    } catch (error) {
      response.status = false;
      response.error = error;
    }
  } else {
    response.status = true;
  }
  return response;
};

export const getUserProfile = async (uid) => {
  const userRef = doc(database, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const profilePost = await ProfileActivity(uid, "Posts");
    const newData = [];
    profilePost.forEach((doc) => {
      const json = doc.data();
      json.documentUid = doc.id;
      json.userPhotoURL = data.photoURL;
      newData.push(json);
    });
    const profilePostForum = await ProfileActivity(uid, "ForumPost");
    profilePostForum.forEach((doc) => {
      const json = doc.data();
      json.documentUid = doc.id;
      json.userPhotoURL = data.photoURL;
      newData.push(json);
    });

    data.posts = newData;
    return data;
  }
};