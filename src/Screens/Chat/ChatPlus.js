import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import { database, auth } from '../../Data/Firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, arrayUnion, } from 'firebase/firestore';
import navigationString from '../../Constant/navigationString';
import { useIsFocused } from '@react-navigation/native';
import { format, parse, differenceInYears } from 'date-fns';
import MatchAlert from '../../Components/matchModal';

var userData = null;

export default function ChatPlus(props) {
    const heighthSize = useWindowDimensions().height
    const navigation = props.navigation
    const [myProfile, setMyprofile] = useState([])
    const isFocused = useIsFocused();
    const [profileArray, setProfileArray] = useState(
        [
           /* { realName: "test User", Images: ['https://images.unsplash.com/photo-1604311795833-25e1d5c128c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8OSUzQTE2fGVufDB8fDB8fHww&w=1000&q=80', 'https://images.unsplash.com/photo-1566895291281-ea63efd4bdbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8OSUzQTE2fGVufDB8fDB8fHww&w=1000&q=80'] },
            { realName: "test User 2", Images: ['https://images.unsplash.com/photo-1581260466152-d2c0303e54f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8OSUzQTE2fGVufDB8fDB8fHww&w=1000&q=80', 'https://i.pinimg.com/736x/69/23/68/692368a05643924d1615d8628daf4e82.jpg'] },
            { realName: "test User 3", Images: ['https://images.pexels.com/photos/9492552/pexels-photo-9492552.jpeg?cs=srgb&dl=pexels-garrison-gao-9492552.jpg&fm=jpg', 'https://images.pexels.com/photos/9492551/pexels-photo-9492551.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'] },
        */]);
    const [imageView, setImageView] = useState(0);
    const [isNewUser, setIsNewUser] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate(navigationString.CHATPLUSPROFILE, myProfile)}>
                    <FontAwesome name="gear" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [myProfile]);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text style={{
                    fontSize: 18,
                    fontWeight: "bold"
                }}>
                    Mach game
                </Text>
            )
        })
        const getMyProfile = async () => {
            const userContent = await getDoc(doc(database, "users", auth.currentUser.uid))
            if (userContent) {
                const data = userContent.data()
                if (!data.matchCreate) {
                    setMyprofile(data)
                    setIsNewUser(true)
                } else {
                    const userContent = await getDoc(doc(database, "MatchProfile", auth.currentUser.uid))
                    if (userContent) {
                        const data2 = userContent.data()
                        setMyprofile({ ...data, ...data2 })
                        setIsNewUser(false)
                        return [{ ...data, ...data2 }]
                    }
                }
            } else {
                alert("Ocurrio un error inesperado, intente nuevamente")
                navigation.goBack()
            }
        }
        getMyProfile()
    }, [isFocused])

    const calculateAge = (birthdate) => {
        const today = new Date();
        const formattedBirthdate = parse(birthdate, 'dd/MM/yyyy', new Date());
        const age = differenceInYears(today, formattedBirthdate);
        return age;
    };

    useEffect(() => {
        const getUsersMatch = async () => {
            const MatchRef = collection(database, "MatchProfile");
            if (myProfile && myProfile.preferences) {
                const preferences = Object.entries(myProfile.preferences)
                    .filter(([key, value]) => value === true)
                    .map(([key, value]) => key);
                var q = query(MatchRef, where('Preferences', 'array-contains-any', preferences), where('userProfileUid', '!=', auth.currentUser.uid))
                const snapshot = await getDocs(q);
                const documents = snapshot.docs.map(doc => {
                    let info = doc.data();
                    if (info.date) {
                        var age = calculateAge(info.date);
                        info.age = age;
                    }
                    return info;
                });
                var filteredDocuments = documents.filter(
                    user => !myProfile.pendingMatches.includes(user.userProfileUid)
                );
                filteredDocuments = filteredDocuments.filter(
                    user => !myProfile.matches.includes(user.userProfileUid)
                )
                const shuffledDocuments = shuffleArray(filteredDocuments);
                if (shuffledDocuments) {
                    setProfileArray(shuffledDocuments);
                }
            }
        };

        const shuffleArray = array => {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        };

        getUsersMatch()
    }, [myProfile])

    function nextUserImage() {
        if (imageView >= profileArray[0].Images.length - 1) {
            return
        }
        setImageView(prevPosition => prevPosition + 1);
    }
    function prevUserImage() {
        if (imageView == 0) {
            return
        }
        setImageView(prevPosition => prevPosition - 1);
    }

    const acceptMatch = async (profileData) => {
        if (profileData) {
            if (profileData.pendingMatches?.includes(auth.currentUser.uid)) {
                await updateDoc(doc(database, 'MatchProfile', profileData.uid), { pendingMatches: arrayRemove(auth.currentUser.uid) })
                await updateDoc(doc(database, 'MatchProfile', profileData.uid), { matches: arrayUnion(auth.currentUser.uid) })
                await updateDoc(doc(database, 'MatchProfile', auth.currentUser.uid), { matches: arrayUnion(profileData.uid) })
                profileArray[0].myProfileImage = myProfile.Images[0]
                const concatArray = profileArray[0]
                userData = concatArray
                setIsModalVisible(true)
            } else {
                if (profileArray[0]) {
                    console.log("tengo que crear una solicitud de match")
                    await updateDoc(doc(database, "MatchProfile", auth.currentUser.uid), {
                        pendingMatches: arrayUnion(profileData.uid)
                    })
                }
            }
            declineMatch()
        }
    }

    const onModalclose = () => {
        setIsModalVisible(false)
        //Navegar a la seccion del nuevo chat
    }

    const declineMatch = () => {
        setImageView(0)
        setProfileArray(prevProfileArray => {
            const newArray = prevProfileArray.filter((_, index) => index !== 0);
            return newArray;
        });
    };

    return (
        <View style={styles.mainContainer}>
            {isNewUser ? (
                <View>
                    <Text>Crear Perfil !</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(navigationString.CHATPLUSPROFILE, myProfile)}>
                        <Text>ir a</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <View style={styles.profileContainer}>

                        <View style={styles.profileImages}>
                            {
                                profileArray.length > 0 && profileArray.length > 0 ? (
                                    <View style={{ flex: 1 }} key={profileArray[0].userName}>
                                        <Image source={{ uri: profileArray[0].Images[imageView] }} style={{ width: "100%", height: "100%" }} />
                                        <TouchableOpacity onPress={() => prevUserImage()} style={styles.prevNavigate} />
                                        <TouchableOpacity onPress={() => nextUserImage()} style={styles.nextNavigate} />
                                        <TouchableOpacity style={{ position: "absolute", bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", width: "100%", height: "15%", paddingHorizontal: 10 }} onPress={() => console.log("mostrar informacion usuario")} >
                                            <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>{profileArray[0].realName}  {profileArray[0].age && <Text style={{ color: "white", top: -15 }}>{profileArray[0].age}</Text>}</Text>
                                            <Text style={{ color: "white" }}>{profileArray[0].profileInformation}</Text>
                                            <View style={{ flexDirection: "row" }}>
                                                {profileArray[0].Preferences.map((item, id) => (<Text style={{ color: "white", paddingRight: 5 }} key={id}>{item}</Text>))}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text style={{ color: "white", }}></Text>
                                )
                            }
                        </View>
                    </View>

                    <View style={styles.footerProfile}>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={{ borderRadius: 35, /*marginLeft: "20%",*/ borderWidth: 2, borderColor: "#DA0000" }} onPress={() => declineMatch()}>
                                <MaterialIcons name="gamepad" size={46} color="#DA0000" style={{ transform: [{ rotate: '45deg' }], padding: 5 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ borderRadius: 35, /*marginLeft: "20%",*/ borderWidth: 2, padding: 5, borderColor: "#50D6D6" }} onPress={() => navigation.navigate(navigationString.MATCHCHATS)}>
                                <Entypo name="chat" size={40} color="#50D6D6" style={{ padding: 5 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ borderRadius: 35, borderWidth: 2, borderColor: "#5AC21F" }} onPress={() => acceptMatch({
                                uid: profileArray[0]?.userProfileUid,
                                pendingMatches: profileArray[0]?.pendingMatches,
                            })}>
                                <Ionicons name="game-controller-outline" size={46} color="#5AC21F" style={{ padding: 5 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )
            }
            <MatchAlert isVisible={isModalVisible} onClose={onModalclose} userData={userData} navigation={navigation} />
        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 0,
        margin: 0,
        backgroundColor: "#fff",
        padding: 5,
    },
    profileContainer: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black"
    },
    footerProfile: {
        width: '100%',
        height: "15%",
        justifyContent: "center",
        alignItems: "center",
    },
    profileImages: {
        width: '100%',
        height: "90%",
        flexDirection: 'row',
    },
    prevNavigate: {
        width: '50%',
        height: '100%',
        //backgroundColor: "purple",
        position: "absolute",
        left: 0,
    },
    nextNavigate: {
        right: 0,
        width: '50%',
        height: '100%',
        //backgroundColor: "red",
        position: "absolute"
    },
    buttonsContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: '80%',
        height: '70%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    imagesContainer: {
        flex: 1,
        backgroundColor: "blue",
        width: "100%",
        height: 250,
        padding: 5,
        marginBottom: 10,
    },
    imagesSubContainer: {
        backgroundColor: "green",
        width: "100%",
        height: "85%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    imageUser: {
        backgroundColor: "yellow",
        width: "30%",
        height: "100%",
    },
    deleteContainer: {
        position: "absolute", right: -5, top: -5, backgroundColor: "black", borderRadius: 15,
    },

})