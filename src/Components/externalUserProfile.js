import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, useWindowDimensions, } from "react-native";
import navigationString from "../Constant/navigationString";
import { getUserProfile } from "../utils/actions";
import moment from "moment-timezone";
import RenderHTML from "react-native-render-html";
import { auth } from "../Data/Firebase";
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc, getDocs, addDoc, setDoc, collection, query, where, deleteDoc } from "firebase/firestore";
import { database } from "../Data/Firebase";

import { MaterialIcons } from "@expo/vector-icons";

const ExternalUserProfile = (props) => {
    const user = {};
    const navigation = props.navigation;
    const profileId = props.route.params;

    const [userProfileData, setUserName] = useState({});
    const [userHaveActuvity, setUserHaveActuvity] = useState(false);
    const [postData, setPostData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { width } = useWindowDimensions();
    const [myProfile, setMyProfile] = useState(false);

    const getProfile = async () => {
        const response = await getUserProfile(profileId);
        if (!response) {
            alert("Error al cargar el perfil");
        }
        setUserName(response);
        const post = response.posts;
        if (post.length > 0) {
            setUserHaveActuvity(true);
            setPostData(post);
        }
        const Data = await getDoc(doc(database, "users", auth.currentUser.uid));
        if (Data) {
            const requestRef = collection(database, "friendRequest");
            const q = query(
                requestRef,
                where("status", "==", "pending"),
                where(
                    "sender",
                    "in",
                    [auth.currentUser.uid, profileId]
                ),
                where(
                    "receiver",
                    "in",
                    [auth.currentUser.uid, profileId]
                )
            );
            const querySnapshot = await getDocs(q);
            console.log("aqui ->", querySnapshot.docs)
            const document = querySnapshot.docs[0];
            if (!querySnapshot.empty) {
                const mergeData = {
                    ...Data.data(),
                    friendRequest: true,
                    sender: querySnapshot.docs[0].data().sender,
                    sender: document.data().sender,
                };
                setMyProfile(mergeData);
                setLoading(true);
            } else {
                const mergeData = {
                    ...Data.data(),
                    friendRequest: false,
                };
                setMyProfile(mergeData);
                setLoading(true);
            }
        }
    };


    useEffect(() => {
        navigation.setOptions({
            headerTitle: "",
        });
        // getProfileData();

        getProfile();
    }, []);
    const handleLike = async (post, typePost) => {
        const currentLikeStatus = !post.likes_by_users.includes(auth.currentUser.uid);

        const postRef = doc(database, typePost, post.documentUid);
        await updateDoc(postRef, {
            likes_by_users: currentLikeStatus ? arrayUnion(auth.currentUser.uid) : arrayRemove(auth.currentUser.uid),
        });
        getProfile();
    };

    const addFriend = async (friendUid) => {
        if (myProfile.friends.includes(friendUid)) {
            return alert("Ya eres amigo de este usuario");
        }
        addDoc(collection(database, "friendRequest"), {
            sender: auth.currentUser.uid,
            receiver: friendUid,
            status: "pending",
        });
        getProfile();
    }

    const removeFriend = async (friendUid) => {
        if (!myProfile.friends.includes(friendUid)) {
            return alert("No eres amigo de este usuario");
        }
        const userRef = doc(database, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
            friends: arrayRemove(friendUid),
        });
        const userRefFriend = doc(database, "users", friendUid);
        await updateDoc(userRefFriend, {
            friends: arrayRemove(auth.currentUser.uid),
        });
        getProfile();
    }

    const acceptFriend = async (firnedUid) => {
        if (myProfile.friends.includes(firnedUid)) {
            return alert("Error al aceptar al usuario");
        }
        const myProfileRef = doc(database, 'users', auth.currentUser.uid);
        await updateDoc(myProfileRef, {
            friends: arrayUnion(firnedUid),
        });
        const friendProfileRef = doc(database, 'users', firnedUid);
        await updateDoc(friendProfileRef, {
            friends: arrayUnion(auth.currentUser.uid),
        });
        const requestRef = collection(database, "friendRequest");
        const q = query(
            requestRef,
            where("status", "==", "pending"),
            where(
                "sender",
                "in",
                [auth.currentUser.uid, profileId]
            ),
            where(
                "receiver",
                "in",
                [auth.currentUser.uid, profileId]
            )
        );
        const querySnapshot = await getDocs(q);
        deleteDoc(querySnapshot.docs[0].ref);
        getProfile();
    }

    const declineFriend = async (friendUid) => {
        const requestRef = collection(database, "friendRequest");
        const q = query(
            requestRef,
            where("status", "==", "pending"),
            where(
                "sender",
                "in",
                [auth.currentUser.uid, friendUid]
            ),
            where(
                "receiver",
                "in",
                [auth.currentUser.uid, friendUid]
            )
        );
        const querySnapshot = await getDocs(q);
        deleteDoc(querySnapshot.docs[0].ref);
        getProfile();
    }

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {loading ? (
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
                                navigation.navigate(navigationString.SHOWIMAGE, { url: userProfileData.photoURL })
                            }}>
                                <Image
                                    style={styles.imageProfile}
                                    source={
                                        userProfileData.photoURL
                                            ? { uri: userProfileData.photoURL }
                                            : require("../Data/Default/profileImage.png")
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
                                    <Text style={{}}>{userProfileData.userName}</Text>
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
                            {userProfileData.informacionPerfil ?? "El usuario no ha escrito nada sobre el"}
                        </Text>
                        {/* Cambiar el acceso a la informacion */}
                    </View>
                    {auth.currentUser.uid !== profileId &&
                        <View style={{ width: "100%", paddingVertical: 10, paddingHorizontal: 10 }}>

                            {myProfile.friends.includes(profileId) ? (
                                <TouchableOpacity style={{
                                    backgroundColor: "#A3E9E6",
                                    width: "35%",
                                    padding: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                    onPress={() => removeFriend(profileId)}
                                >

                                    <Text style={{ fontSize: 16 }}>Eliminar amigo</Text>

                                </TouchableOpacity>
                            ) : myProfile.friendRequest ?
                                (
                                    myProfile.sender === auth.currentUser.uid ? (
                                        <TouchableOpacity style={{
                                            backgroundColor: "#A3E9E6",
                                            width: "30%",
                                            padding: 5,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                            onPress={() => declineFriend(profileId)}
                                        >

                                            <Text style={{ fontSize: 16 }}>Cancelar solicitud</Text>

                                        </TouchableOpacity>
                                    ) : (
                                        <View style={{ flexDirection: "row" }}>
                                            <TouchableOpacity style={{
                                                backgroundColor: "#A3E9E6",
                                                width: "30%",
                                                padding: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: "row",
                                                marginRight: 10
                                            }}
                                                onPress={() => acceptFriend(profileId)}
                                            >

                                                <Text style={{ fontSize: 16 }}>Aceptar </Text>
                                                <MaterialIcons name="check" size={24} color="black" />

                                            </TouchableOpacity>
                                            <TouchableOpacity style={{
                                                backgroundColor: "#A3E9E6",
                                                width: "30%",
                                                padding: 5,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: "row"
                                            }}
                                                onPress={() => declineFriend(profileId)}
                                            >

                                                <Text style={{ fontSize: 16 }}>Rechazar </Text>
                                                <MaterialIcons name="close" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>

                                    )
                                ) : (
                                    <TouchableOpacity style={{
                                        backgroundColor: "#A3E9E6",
                                        width: "30%",
                                        padding: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                        onPress={() => addFriend(profileId)}
                                    >

                                        <Text style={{ fontSize: 16 }}>Añadir amigo</Text>

                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    }
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
                        <Text style={{ fontSize: 22, fontWeight: 400 }}>Activadad</Text>
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


                            {userHaveActuvity ? (
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
                                                        <Image source={user.photoURL} style={{ width: 50, height: 50, borderRadius: 200 / 2 }} />
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
                                                <View>
                                                    <Text style={{ fontSize: 18 }}>{item.title}</Text>
                                                    <Text>
                                                        {moment
                                                            .tz(item.dateTime.toDate(), "America/Santiago")
                                                            .format("DD/MM/YYYY")}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: "row", padding: 5 }}>
                                                    <View
                                                        style={{
                                                            borderWidth: 1,
                                                            borderRadius: 25,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 2,
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            textAlign: "center",
                                                            borderColor: "#BBBBBB",
                                                            marginRight: 5,
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: 14 }}>{item.category}</Text>
                                                    </View>
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
                                    <Text style={{ fontSize: 20, textAlign: "center" }}>
                                        ups.. usuario sin publicaciones 🤕
                                    </Text>
                                </View>
                            )}
                        </>
                    </View>
                </View>
            ) : (
                <View>
                    <Text>Cargando...</Text>
                    <ActivityIndicator size="large" />
                </View>
            )
            }
        </ScrollView >
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


export default ExternalUserProfile;