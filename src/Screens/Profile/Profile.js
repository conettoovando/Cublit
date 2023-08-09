import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { auth } from "../../Data/Firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getProfileData } from "../../utils/actions";
import MyModal from "../../Components/Modal";
import { ProfileActivity } from "../../utils/Querys";
import RenderHTML from "react-native-render-html";
import { Image } from "expo-image";
import credenciales from "../../Constant/credentials";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { database } from "../../Data/Firebase";

//Drawer

//iconos
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import navigationString from "../../Constant/navigationString";
import moment from "moment-timezone";

//Buttons
import button from "../../utils/buttons";

export default function Profile({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userHaveActuvity, setUserHaveActuvity] = useState(false);

  const onHandleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.replace("Login")
      }).catch(error => alert(error.message))
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const fetchProfileData = async () => {
        const result = await getProfileData();
        setTextInformation(result.informacionPerfil);
      };
      fetchProfileData();
      consulta();
      return unsubscribe;
    });
    navigation.setOptions({
      headerLargeTitle: false,
      headerTitle: "Perfil",
      headerTitleStyle: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        alignSelf: "center",
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsModalOpen(!isModalOpen)}>
          <Icon name="menu" size={30} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const user = auth.currentUser;
  const [userName, setUserName] = useState(user.displayName);
  const [photoUrl, setPhotoUrl] = useState(user.photoURL);

  const [TextIInformation, setTextInformation] = useState("");

  const [postData, setPostData] = useState([]);

  const consulta = async () => {
    const profilePost = await ProfileActivity(user.uid, "Posts");
    const newData = [];
    profilePost.forEach((doc) => {
      const json = doc.data();
      json.documentUid = doc.id;
      json.userPhotoURL = user.photoURL;
      newData.push(json);
    });
    const profilePostForum = await ProfileActivity(user.uid, "ForumPost");
    profilePostForum.forEach((doc) => {
      const json = doc.data();
      json.documentUid = doc.id;
      json.userPhotoURL = user.photoURL;
      newData.push(json);
    });
    setPostData(newData); // Guardar los nuevos posts en el estado existente
    setIsLoading(true);
    if (newData.length > 0) {
      setUserHaveActuvity(true);
    }
  };
  const { width } = useWindowDimensions();

  const Contents = (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate(navigationString.EDIT_PROFILE), setIsModalOpen(!isModalOpen); }}>
        <Text style={styles.buttonText}>Configurar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate(navigationString.PREF), setIsModalOpen(!isModalOpen); }}>
        <Text style={styles.buttonText}>Configurar Preferencias</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { onHandleLogout(), setIsModalOpen(!isModalOpen); }}>
        <Text style={styles.buttonText}>Cerrar sesion</Text>
      </TouchableOpacity>
    </View>
  )

  const handleLike = async (post, typePost) => {
    const currentLikeStatus = !post.likes_by_users.includes(auth.currentUser.uid);

    const postRef = doc(database, typePost, post.documentUid);
    await updateDoc(postRef, {
      likes_by_users: currentLikeStatus ? arrayUnion(auth.currentUser.uid) : arrayRemove(auth.currentUser.uid),
    });
    consulta();
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.subcontainer}>
        <View
          style={{
            width: "100%",
            borderColor: "#BBBBBB",
            borderWidth: 1,
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => {
              navigation.navigate(navigationString.SHOWIMAGE, { url: photoUrl })
            }}>
              <Image
                style={styles.imageProfile}
                source={
                  user.photoURL != null && user.photoURL != ""
                    ? { uri: photoUrl }
                    : require("../../Data/Default/profileImage.png")
                }
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{ textAlign: "center", fontSize: 16, fontWeight: 500, marginBottom: 6 }}
              >
                Nombre de usuario
              </Text>
              <Text style={styles.TextInputRow}>
                <Text style={{}}>{userName}</Text>
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: 90,
            borderColor: "#BBBBBB",
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 16.5, paddingHorizontal: 10, paddingVertical: 7 }}>
            {TextIInformation
              ? TextIInformation
              : "el usuario aun no completa su perfil"}
          </Text>
          {/* Cambiar el acceso a la informacion */}
        </View>
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            width: "95%",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            borderBottomColor: "rgba(0,0,0,0.4)",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: 400 }}>Tu Activadad</Text>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 10,
          }}
        >
          <>
            {isLoading ? (
              userHaveActuvity ? (
                <View style={{ width: "100%", paddingHorizontal: 10 }}>
                  {postData.map((item, index) => (
                    item.gameName ? (
                      <View
                        key={index}
                        style={{
                          width: "100%",
                          padding: 10,
                          borderColor: "#BBBBBB",
                          borderWidth: 1,
                          marginBottom: 15,
                        }}
                      >
                        <View
                          style={{ marginBottom: 10 }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <Image source={
                              user.photoURL != null && user.photoURL != ""
                                ? { uri: photoUrl }
                                : require("../../Data/Default/profileImage.png")
                            } style={{ width: 50, height: 50, borderRadius: 200 / 2 }} />
                            <View style={{ marginLeft: 5 }}>
                              <Text style={{ fontSize: 12 }}>{user.displayName}</Text>
                              <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item.gameName}</Text>
                            </View>
                            <Text style={{ right: 0, position: "absolute" }}>
                              {moment
                                .tz(item.dateTime.toDate(), "America/Santiago")
                                .format("DD/MM/YYYY")}
                            </Text>
                          </View>
                          <View
                            style={{
                              marginTop: 5,
                            }}
                          >
                            <Text>{item.postText}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingtop: 5 }}>
                          <View style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }}>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => handleLike(item, "ForumPost")}>
                              {item.likes_by_users.includes(auth.currentUser.uid) ? (
                                <AntDesign name="heart" size={24} color="red" />
                              ) : (
                                <Feather name="heart" size={24} color="black" />
                              )}
                            </TouchableOpacity>
                            <Text>{item.likes_by_users.length}</Text>
                          </View>
                          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }}
                            onPress={() => {
                              navigation.navigate(navigationString.COMENTS, item);
                            }}>
                            <Feather name="message-circle" size={24} color="black" style={{ marginRight: 5 }} />
                            <Text>{Object.values(item.coments_by_users).length}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                    ) : (
                      <TouchableOpacity
                        key={index}
                        style={{
                          width: "100%",
                          padding: 10,
                          borderColor: "#BBBBBB",
                          borderWidth: 1,
                          marginBottom: 15,
                        }}
                        onPress={() =>
                          navigation.navigate(navigationString.POSTDETAILS, item)
                        }
                      >
                        <View >
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                              source={
                                user.photoURL != null && user.photoURL != ""
                                  ? { uri: photoUrl }
                                  : require("../../Data/Default/profileImage.png")
                              }
                              style={{ width: 50, height: 50, borderRadius: 200 / 2 }}
                            />
                            <View style={{ marginLeft: 10 }}>
                              <Text style={{ fontSize: 18 }}>{item.title}</Text>
                              <View style={{ flexDirection: "row", marginTop: 2, left: -5 }}>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    paddingHorizontal: 10,
                                    justifyContent: "center",
                                    textAlign: "center",
                                    borderColor: "#BBBBBB",
                                    marginRight: 5,
                                  }}
                                >
                                  <Text style={{ fontSize: 14 }}>{item.category}</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                          <Text
                            style={{
                              position: "absolute",
                              right: 0,
                            }}
                          >
                            {moment
                              .tz(item.dateTime.toDate(), "America/Santiago")
                              .format("DD/MM/YYYY")}
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 80,
                            borderWidth: 1,
                            borderColor: "#BBBBBB",
                            marginTop: 5,
                          }}
                        >
                          <RenderHTML
                            baseStyle={{
                              fontSize: 14,
                              textAlign: "justify",
                              lineHeight: 20,
                              padding: 5,
                              overflow: "hidden",
                              flex: 1,
                            }}
                            source={{ html: item.content }}
                            contentWidth={width}
                            tagsStyles={{
                              img: {
                                display: "none",
                              },
                            }}
                          />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                          <View style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }}>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => handleLike(item, "Posts")}>
                              {item.likes_by_users.includes(auth.currentUser.uid) ? (
                                <AntDesign name="heart" size={24} color="red" />
                              ) : (
                                <Feather name="heart" size={24} color="black" />
                              )}
                            </TouchableOpacity>
                            <Text>{item.likes_by_users.length}</Text>
                          </View>
                          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }} onPress={() => navigation.navigate(navigationString.COMENTS, item)}>
                            <Feather name="message-circle" size={24} color="black" style={{ marginRight: 5 }} />
                            <Text>{Object.values(item.coments_by_users).length}</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    )

                  ))}
                </View>
              ) : (
                <View
                  style={{
                    width: "100%",
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, textAlign: "center" }}>
                    Aun no subes tu primera publicacion no te quedes atras! 🚀
                  </Text>
                  <TouchableOpacity
                    style={button.button}
                    onPress={() =>
                      navigation.navigate(navigationString.HOME_NEW_POST)
                    }
                  >
                    <Text style={button.buttonText}>Subir</Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View>
                <Text>Cargando...</Text>
                <ActivityIndicator size="large" />
              </View>
            )}
          </>
        </View>
      </View>
      <MyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} title={"Configuracion"} content={Contents} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  subcontainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#E99D42",
    width: 200,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  title: {
    padding: 10,
    fontSize: 30,
    width: "100%",
    textAlign: "center",
  },
  imageProfile: {
    marginLeft: -10,
    marginRight: 20,
    width: 110,
    height: 110,
    borderRadius: 200 / 2,
  },
  TextInputRow: {
    width: 200,
    backgroundColor: "#F0F0F0",
    padding: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 20,
  },
  TextInput: {
    width: "90%",
    backgroundColor: "#F0F0F0",
    borderRadius: 30,
    padding: 10,
    margin: 5,
  },
  textInput: {
    textAlign: "left",
    width: "80%",
    fontSize: 20,
    fontFamily: "cheese_Smile",
  },
});
