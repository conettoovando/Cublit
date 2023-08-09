import { database } from "../Data/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
  doc,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../Data/Firebase";

export const ProfileActivity = async (uid, colect) => {
  const userRef = collection(database, colect);
  const q = query(
    userRef,
    where("uid", "==", uid),
    orderBy("dateTime", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const ProfileUserQuery = async (Coleccion, value, condicion, uid) => {
  const userRef = collection(database, Coleccion);
  const q = query(userRef, where(value, condicion, uid));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs[0].data();
  return data.photoURL;
};

export const PostDisplayerForPreferences = async () => {
  const user = auth.currentUser;
  const userDoc = await getDoc(doc(database, "users", user.uid));
  const userData = userDoc.data();
  const category = userDoc.data().preferences;
  const categories = Object.keys(category).filter(
    (categoria) => category[categoria]
  );
  categories.push("Juegos Generales");
  return categories;
};

export const ResquestApis = async (
  url = String,
  options = { method: "POST" }
) => {
  const response = { status: null, data: null };
  try {
    const request = new Request(url, options);
    const fetchRequest = await fetch(request);
    response.data = await fetchRequest.json();
    response.status = true;
    return response;
  } catch {
    response.status = false;
    return response;
  }
};

export const SearchPostWithGameName = async (name) => {
  const Response = { status: false, Data: [] };
  const userRef = collection(database, "ForumPost");
  const querySnapshot = await getDocs(
    query(userRef, where("gameName", "==", name), limit(25))
  );
  const newResponse = [];
  for (const document of querySnapshot.docs) {
    const json = document.data();

    // Obtener el UID del documento
    const documentUid = document.id;

    // Obtener la URL de la foto de usuario desde la colección "users"
    const userDocRef = doc(database, "users", json.uid);
    const userDoc = await getDoc(userDocRef);
    const userJson = userDoc.data();
    const userPhotoURL = userJson.photoURL;

    // Agregar el UID del documento y la URL de la foto de usuario al objeto
    json.documentUid = documentUid;
    json.userPhotoURL = userPhotoURL;

    newResponse.push(json);
  }

  const sortResponse = newResponse.sort(
    (a, b) => b.dateTime.toDate() - a.dateTime.toDate()
  );
  if (sortResponse.length > 0) {
    Response.Data = sortResponse;
    Response.status = true;
  }
  return Response;
};

