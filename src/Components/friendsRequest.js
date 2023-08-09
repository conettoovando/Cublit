import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { auth, database } from '../Data/Firebase';
import { collection, getDoc, onSnapshot, query, where, doc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import navigationString from "../Constant/navigationString"

import { MaterialIcons } from '@expo/vector-icons';

export default function FriendsRequest(props) {
    const navigation = props.navigation;
    const user = auth.currentUser;
    const [friendRequest, setFriendRequest] = useState([]);
    useEffect(() => {
        const requetsRef = collection(database, 'friendRequest');
        const q = query(requetsRef, where('receiver', '==', user.uid));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const updatedRequest = [];
            for (const docChange of snapshot.docChanges()) {
                if (docChange.type == "added") {
                    const request = docChange.doc.data();

                    const useRef = doc(database, 'users', request.sender);
                    const usersnapshot = await getDoc(useRef);
                    if (!usersnapshot.empty) {
                        const user = usersnapshot.data();
                        const addupdatedRequest = {
                            ...request, userName: user.userName, userPhoto: user.photoURL, friendRequestUid: docChange.doc.id
                        };
                        updatedRequest.push(addupdatedRequest);
                    }
                }
            }
            setFriendRequest(updatedRequest);

        });
        return () => unsubscribe();
    }, [user])

    const AddFriends = async (userUid, documentUid) => {
        const StatusExec = { personal: false, friend: false };
        const personalRef = await getDoc(doc(database, "users", auth.currentUser.uid));
        const friendRef = await getDoc(doc(database, "users", userUid));

        if (personalRef && friendRef) {
            var friendsAdded = personalRef.data().friends;
            var newArray = [...friendsAdded, userUid];
            await updateDoc(doc(database, "users", auth.currentUser.uid), {
                friends: newArray
            }).then(StatusExec.personal = true)
            var friendsAdded = friendRef.data().friends
            var newArray = [...friendsAdded, auth.currentUser.uid]
            await updateDoc(doc(database, "users", userUid), {
                friends: newArray
            }).then(StatusExec.friend = true)
            if (StatusExec.friend && StatusExec.personal) {
                await deleteDoc(doc(database, "friendRequest", documentUid))
            }
        }
    };

    const DeclineFriends = async (documentUid) => {
        await deleteDoc(doc(database, "friendRequest", documentUid))
    };


    return (
        <>
            {friendRequest.map((request, id) => (
                <View style={{ flexDirection: 'row', alignItems: "center" }} key={id}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center" }} onPress={() => navigation.navigate(navigationString.EXTERNALUSERPROFILE, request.sender)}>
                        <Image source={request.userPhoto ? { uri: request.userPhoto } : require('../Data/Default/profileImage.png')} style={{ width: 50, height: 50, borderRadius: 50, margin: 10 }} />
                        <Text>{request.userName}</Text>
                    </TouchableOpacity>
                    <View style={{ position: "absolute", right: 10, flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => AddFriends(request.sender, request.friendRequestUid)} style={{ marginRight: 10 }}>
                            <MaterialIcons name="check" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => DeclineFriends(request.friendRequestUid)}>
                            <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </>
    )
}