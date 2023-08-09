import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions, TextInput, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import navigationString from "../Constant/navigationString";
import { database, auth } from "../Data/Firebase";
import { collection, updateDoc, doc, onSnapshot, Timestamp, getDoc } from "firebase/firestore";
import { useEffect } from "react";

let comments = [];
let userId = '';
let postId = '';
const Coments = (props) => {
    const user = auth.currentUser;
    const post = props.route.params;
    const [coment, setComent] = React.useState("")
    const inputRef = React.useRef();
    const [commentsList, setCommentsList] = React.useState([]);

    const getUserName = async (userId) => {
        const userRef = doc(database, "users", userId);
        const docSnap = await getDoc(userRef);
        return docSnap.data().photoURL;
    }

    useEffect(() => {
        const fetchdata = async () => {
            postId = post.documentUid;
            comments = post.coments_by_users;
            for (let i = 0; i < comments.length; i++) {
                let photo = await getUserName(comments[i].userId);
                comments[i].userPhotoURL = photo;
            }
            comments.sort((a, b) => b.dateTime - a.dateTime);
            setCommentsList(comments);
        }
        fetchdata();
    }, [])

    const selectImage = (image) => {
        props.navigation.navigate(navigationString.SHOWIMAGE, { url: image })
    }

    const postcoment = (dataName) => {
        let tempComent = comments;
        tempComent.push({ userId: user.uid, userName: user.displayName, userPhotoURL: user.photoURL, comentText: coment, dateTime: Timestamp.now().toDate() });
        const postRef = doc(database, dataName, post.documentUid);
        updateDoc(postRef, {
            coments_by_users: tempComent
        }).then(() => {
            getNewComent(dataName);
        })
        inputRef.current.clear();
    }

    const getNewComent = (dataName) => {
        const postRef = doc(database, dataName, post.documentUid);
        const unsubscribe = onSnapshot(postRef, (doc) => {
            const coment = doc.data().coments_by_users;
            coment.sort((a, b) => b.dateTime - a.dateTime);
            setCommentsList(coment);
        });
        return () => unsubscribe();
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : null} keyboardVerticalOffset={100}>
            <View style={styles.container}>
                <View >
                    <View style={styles.header}>
                        {post.userPhotoURL ? <Image source={{ uri: post.userPhotoURL }} style={styles.profileImage} /> : <Image source={require("../Data/Default/profileImage.png")} style={styles.profileImage} />}
                        <View >
                            <Text style={styles.userName}>{post.userName}</Text>
                            <Text style={styles.postText}>{post.postText}</Text>
                        </View>
                    </View>
                    {post.Images && post.Images.length > 0 ? (
                        <TouchableOpacity style={{ borderWidth: 1, borderBottomColor: "#ccc" }} onPress={() => selectImage(post.Images[0])}>
                            <Image source={{ uri: post.Images[0] }} style={styles.postImage} />
                        </TouchableOpacity>
                    ) : null}
                </View>

                <FlatList
                    data={commentsList}
                    renderItem={({ item, index }) => {
                        return (
                            <ScrollView style={styles.comentContainer}>
                                <TouchableOpacity style={[styles.header, { borderBottomWidth: 0 }]} onPress={() => props.navigation.navigate(navigationString.EXTERNALUSERPROFILE, item.userId)}>
                                    {item.userPhotoURL ? <Image source={{ uri: item.userPhotoURL }} style={styles.profileImage} /> :
                                        <Image source={require("../Data/Default/profileImage.png")} style={styles.profileImage} />}
                                    <View >
                                        <Text style={styles.userName}>{item.userName}</Text>
                                        <Text style={styles.postText}>{item.comentText}</Text>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        )
                    }}
                />
                <View style={styles.inputContainer}>
                    {console.log(user.photoURL)}
                    <Image source={user.photoURL != null ? { uri: user.photoURL } : require("../Data/Default/profileImage.png")} style={[styles.profileImage, { marginRight: 10 }]} />
                    <TextInput style={styles.textinput} placeholder="Agrega un comentario..." multiline onChangeText={(text) => setComent(text)} ref={inputRef} />
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => post.Images ? postcoment('ForumPost') : postcoment('Posts')}>
                        <Text style={{ color: "#318bfb", fontWeight: "bold" }}>Publicar</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </KeyboardAvoidingView>
    );
}

export default Coments;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 0,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 200 / 2,
    },
    userName: {
        fontSize: 12,
        marginLeft: 10,
    },
    postText: {
        fontSize: 14,
        paddingHorizontal: 10,
    },
    postContainer: {
        padding: 10,
    },
    postImage: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width / 3,
    },
    comentContainer: {
        padding: 0,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    textinput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 80,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
})

