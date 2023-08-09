import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import { database, auth } from '../../Data/Firebase';
import { getDoc, doc } from 'firebase/firestore';
import navigationString from '../../Constant/navigationString';

export default function MatchChats(props) {
    const [isLoadMatches, setIsLoadMatches] = useState(false)
    const [MatchesFriends, setMatchesFriends] = useState([])
    const navigation = props.navigation
    const user = auth.currentUser

    const getMatches = async () => {
        const collectionRef = doc(database, "MatchProfile", user.uid);
        const data = await getDoc(collectionRef);
        const friends = data.data().matches;
        const chats = [];
        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];
            const friendRef = doc(database, "MatchProfile", friend);
            const friendData = await getDoc(friendRef);
            chats.push(friendData.data());
        }
        setMatchesFriends(chats)
        setIsLoadMatches(true)
    }

    useEffect(() => {
        getMatches()
    }, [navigation])

    if (isLoadMatches) {
        return (
            <View style={styles.container}>
                <View>
                    <Text>Game matches</Text>
                </View>
                <FlatList
                    ItemSeparatorComponent={
                        Platform.OS !== 'android' &&
                        (({ highlighted }) => (
                            <View
                                style={[styles.separator, highlighted && { marginLeft: 0 }]}
                            />
                        ))
                    }
                    data={MatchesFriends}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigation.navigate(navigationString.CHAT, { data: { profileImage: item.Images[0], userName: item.realName, userUid: item.userProfileUid }, collection: "matchChats" })}
                            style={styles.userMatchContainer}
                        >
                            <View style={styles.matchContainer}>
                                <Image
                                    source={{ uri: item.Images[0] }}
                                    style={styles.profileImageMatch}
                                />
                                <View style={styles.matchContainerText}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>
                                        {item.userName}
                                    </Text>
                                    <View style={styles.preferencesContainer}>
                                        {item.Preferences.map((preference, id) => ( // Nombre de variable cambiado a "preference"
                                            <Text
                                                key={id}
                                                style={styles.preferenceText}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {preference}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10
    },
    matchContainer: {
        marginTop: 10,

        flexDirection: "row"
    },
    userMatchContainer: {
        paddingVertical: 10,
    },
    profileImageMatch: {
        width: 90,
        height: 90,
        borderRadius: 45
    },
    matchContainerText: {
        flex: 1,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    preferencesContainer: {
        flexDirection: 'row',
        overflow: 'hidden',
    },
    preferenceText: {
        marginRight: 5,
    },
})