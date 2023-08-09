import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { collection, addDoc, orderBy, query, onSnapshot, updateDoc, where } from "firebase/firestore";
import { auth, database } from "../../Data/Firebase";
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import navigationString from '../../Constant/navigationString';


export default function Chat(props) {
    const [messages, setMessages] = useState([])
    const navigation = useNavigation();
    const params = props.route.params.data;
    const collectionName = props.route.params.collection
    console.log(collectionName)
    const userUid = params.userUid;
    const userName = params.userName;
    const profileImage = params.profileImage;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => navigation.navigate(navigationString.EXTERNALUSERPROFILE, userUid)}>
                    <Image source={profileImage != null ? { uri: profileImage } : require("../../Data/Default/profileImage.png")} style={{ width: 40, height: 40, borderRadius: 20 }} />
                    <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 16 }}>{userName}</Text>
                </TouchableOpacity>
            ),
        })
    }, [navigation])

    useLayoutEffect(() => {
        const collectionRef = collection(database, collectionName);
        const q = query(collectionRef,
            where("user._id", "in", [auth.currentUser.uid, userUid]),
            where("to", "in", [auth.currentUser.uid, userUid]),
            orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(
                snapshot.docs.map((doc) => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                }))
            )
        });
        return () => unsubscribe();
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const { _id, createdAt, text, user } = messages[0];
        const collectionRef = collection(database, collectionName);
        addDoc(collectionRef, {
            _id,
            createdAt,
            text,
            user,
            to: userUid,
        })
    }, [])


    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth.currentUser.uid,
                name: auth.currentUser.displayName,
                avatar: auth.currentUser.photoURL
            }}
            messagesContainerStyle={{
                backgroundColor: "#fff",
            }}
        />
    )
}