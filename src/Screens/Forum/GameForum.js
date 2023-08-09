import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions, Image } from "react-native";
import navigationString from "../../Constant/navigationString";

//icons
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { auth, database } from "../../Data/Firebase";
import { getDocs, collection, query, where, limit, onSnapshot, getDoc, doc, updateDoc, arrayUnion, arrayRemove, orderBy } from "firebase/firestore";
let deviceWidth = Dimensions.get("window").width;

function GameForum(props) {
    const GameDetails = props.route.params;
    const [GamesPosts, setGamePosts] = useState([]);

    useEffect(() => {
        props.navigation.setOptions({
            headerLargeTitle: false,
            headerTitle: "",
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => props.navigation.navigate(navigationString.FORUMPOST, props.route.params.name)}
                    style={{
                        backgroundColor: "blue",
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        justifyContent: "center",
                        marginRight: 10,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        +
                    </Text>
                </TouchableOpacity>
            ),
        });

    }, [props.navigation]);

    useEffect(() => {
        const gamePostsRef = collection(database, 'ForumPost');
        const q = query(gamePostsRef, where('gameName', '==', GameDetails.name), limit(10), orderBy('dateTime', 'desc'));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const postsData = [];
            for (const docs of snapshot.docs) {
                const PostData = docs.data()
                const documentUid = docs.id;
                const userDocRef = doc(database, 'users', PostData.uid);
                const userDoc = await getDoc(userDocRef);
                const userJson = userDoc.data();
                PostData.documentUid = documentUid;
                PostData.userPhotoURL = userJson.photoURL;
                postsData.push(PostData);
            }

            setGamePosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    const handleLike = async (post) => {
        const currentLikeStatus = !post.likes_by_users.includes(auth.currentUser.uid);

        const postRef = doc(database, 'ForumPost', post.documentUid);
        await updateDoc(postRef, {
            likes_by_users: currentLikeStatus ? arrayUnion(auth.currentUser.uid) : arrayRemove(auth.currentUser.uid),
        });
    };


    return (
        <ScrollView style={{ flex: 1 }}>
            <View >
                <View style={[styles.GameContianer, { marginBottom: 5 }]}>
                    <Image
                        style={styles.GamePhoto}
                        source={GameDetails.urlImage ? { uri: `https:${GameDetails.urlImage}` } : require("../../Data/Default/No-image.png")}
                    />
                    <View style={styles.TitleContainer}>
                        <Text style={styles.titleText}>{GameDetails.name}</Text>
                        <View style={{ flexDirection: "row" }}>
                            {GameDetails.categorias ? (
                                GameDetails.categorias.map((index, N) => (
                                    <TouchableOpacity key={N} style={{ paddingHorizontal: 5 }}>
                                        <Text>{index}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (<Text>No hay categorias :(</Text>)}
                        </View>
                    </View>
                </View>
                <View >
                    {GamesPosts.length > 0 ? (
                        GamesPosts.map((index, id) => (
                            <View key={index.documentUid} style={styles.postContainer} >
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 5 }} onPress={() => props.navigation.navigate(navigationString.EXTERNALUSERPROFILE, index.uid)}>
                                    <Image source={index.userPhotoURL ? { uri: index.userPhotoURL } : (require("../../Data/Default/profileImage.png"))} style={{ width: 50, height: 50, borderRadius: 200 / 2 }} />
                                    <Text style={{ fontSize: 16, marginLeft: 5 }}>{index.userName}</Text>
                                </TouchableOpacity>
                                <View style={{ padding: 5 }}>
                                    <Text>{index.postText}</Text>
                                </View>
                                {index.Images.length > 0 ? (
                                    console.log(index.Images[0]),
                                    <TouchableOpacity onPress={() => props.navigation.navigate(navigationString.SHOWIMAGE, { url: index.Images[0] })}>
                                        <Image source={{ uri: index.Images[0] }} style={{ width: deviceWidth, height: deviceWidth }} />
                                    </TouchableOpacity>
                                ) : null}
                                <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                                    <View style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }}>
                                        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => handleLike(index)}>
                                            {index.likes_by_users.includes(auth.currentUser.uid) ? (
                                                <AntDesign name="heart" size={24} color="red" />
                                            ) : (
                                                <Feather name="heart" size={24} color="black" />
                                            )}
                                        </TouchableOpacity>
                                        <Text>{index.likes_by_users.length}</Text>
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }} onPress={() => props.navigation.navigate(navigationString.COMENTS, index)}>
                                        <Feather name="message-circle" size={24} color="black" style={{ marginRight: 5 }} />
                                        <Text>{Object.values(index.coments_by_users).length}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        ""
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

export default GameForum

const styles = StyleSheet.create({
    GameContianer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 10,
        backgroundColor: "white"
    },
    GamePhoto: {
        width: 100,
        height: 100,
        marginLeft: 20,
        marginRight: -20,
        marginTop: 10,
    },
    TitleContainer: {
        padding: 20,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flex: 1,
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold"
    },
    postContainer: {
        paddingTop: 10,
        borderBottomWidth: 10,
        backgroundColor: "white",
        borderColor: "gray",
        paddingBottom: 10,
        borderColor: "#ccc"
    },
})