import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { auth, database } from "../../Data/Firebase";
import { doc, getDoc } from "firebase/firestore";
import navigationString from "../../Constant/navigationString";
import { SimpleLineIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import MyModal from "../../Components/Modal";


export default function ChatPlusHome(props) {
    const navigation = props.navigation;
    const user = auth.currentUser;
    const [recentChats, setRecentChats] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Chatplus",
            headerRight: () => (
                <TouchableOpacity onPress={() => setIsModalOpen(!isModalOpen)} style={{ marginRight: 10 }}>
                    <SimpleLineIcons name="game-controller" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
        const getFriends = async () => {
            const collectionRef = doc(database, "users", user.uid);
            const data = await getDoc(collectionRef);
            const friends = data.data().friends;
            const chats = [];
            for (let i = 0; i < friends.length; i++) {
                const friend = friends[i];
                const friendRef = doc(database, "users", friend);
                const friendData = await getDoc(friendRef);
                const chat = {
                    userName: friendData.data().userName,
                    userUid: friend,
                    profileImage: friendData.data().photoURL,
                }
                chats.push(chat);
            }
            setRecentChats(chats);
        }

        getFriends();
    }, [])

    // Resto del código de tu componente
    const Content = (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate(navigationString.FRIENDSREQUEST), setIsModalOpen(!isModalOpen); }}>
                <Text style={styles.buttonText}>Solicitudes Amistad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate(navigationString.CHATPLUS), setIsModalOpen(!isModalOpen); }}>
                <Text style={styles.buttonText}>ChatPlus+</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ padding: 10 }}>
                    <View>
                        <Text style={{ marginLeft: 10, fontSize: 15, fontWeight: "bold" }}>Amigos</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TextInput value={search} placeholder="Buscar usuario" onChange={(text) => setSearch(text)} style={{ width: "100%", paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: "#ccc", marginTop: 5 }} />
                        <Entypo style={{ position: "absolute", right: 10, color: "gray" }} name="magnifying-glass" size={24} color="black" />
                    </View>
                    {recentChats.map((chat, id) => (
                        <TouchableOpacity key={id} onPress={() => navigation.navigate(navigationString.CHAT, { data: chat, collection: "chats" })} style={{ flexDirection: "row", alignItems: "center", paddingTop: 10 }}>
                            <Image source={(chat.profileImage != null) ? { uri: chat.profileImage } : require("../../Data/Default/profileImage.png")} style={{ width: 50, height: 50, borderRadius: 30 }} />
                            <View style={{ marginLeft: 10, overflow: "hidden", flex: 1 }}>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{chat.userName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <MyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} title={"Navegar a.."} content={Content} />
        </>
    );
}
