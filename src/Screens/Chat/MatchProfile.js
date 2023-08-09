import React, { useState, useEffect } from "react"
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image, TextInput, KeyboardAvoidingView } from "react-native"
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import navigationString from "../../Constant/navigationString"
import { uploadImage } from "../../utils/actions";
import { auth, database } from "../../Data/Firebase";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function MatchProfile(props) {
    const navigation = props.navigation

    const profileParams = props.route.params
    const [textInputValue, setTextInputValue] = useState(profileParams.profileInformation ?? "");
    const [textUserName, setTextUserName] = useState(profileParams.realName ?? '');
    const maxLength = 250;

    const [image, setImage] = useState([null, null, null]);
    const [loadImages, setLoadImages] = useState(false);
    useEffect(() => {
        if (profileParams.Images) {
            profileParams.Images.forEach((element, id) => {
                image[id] = element
            });
            setImage(image)
            setLoadImages(true)
        }
    }, [loadImages])

    const agregarImagen = async (posicion) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [9, 16],
            quality: 1,
        });

        if (!result.canceled) {
            const updatedImage = [...image];
            updatedImage[posicion] = result.assets[0].uri;
            setImage(updatedImage);
        }
    };

    const handleEliminarImagen = (posicion) => {
        const updatedImage = [...image];
        updatedImage[posicion] = null;
        setImage(updatedImage);
    };

    const saveData = async (data) => {

        const includesValueOtherThanNull = data.Images.some((value) => value !== null);
        if (includesValueOtherThanNull) {
            const allImages = data.Images.filter((value) => value != null);
            const objectsToUpload = data.Images.filter((value) => value !== null && !value.startsWith("https://"));
            for (let value of objectsToUpload) {
                const correspondingIndexInAllImages = allImages.indexOf(value);
                const fileName = Date.now().toString();
                const url = await uploadImage(value, "imagesMatch", fileName)
                allImages[correspondingIndexInAllImages] = url.url;
            }
            data.Images = allImages
            try {
                await setDoc(doc(database, "MatchProfile", auth.currentUser.uid), data);
                const updateRef = doc(database, "users", auth.currentUser.uid);
                await updateDoc(updateRef, {
                    matchCreate: true
                })
                navigation.goBack()
            } catch (err) {
                console.log(err)
            }

        }
    }

    var dataUpload = {
        userProfileUid: profileParams.uid ?? auth.currentUser.uid,
        userName: profileParams.userName,
        realName: textUserName ?? '',
        profileInformation: textInputValue ?? '',
        Intereses: null ?? '',
        Preferences: Object.entries(profileParams.preferences).filter(([key, value]) => value === true).map(([key, value]) => key) ?? '',
        Images: image ?? '',
        date: profileParams.date ?? '',
        sex: profileParams.sex ?? '',
        matches: profileParams.matches ?? [],
        pendingMatches: profileParams.pendingMatches ?? [],
    }


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => saveData(dataUpload)}>
                    <Text style={{ color: "#007AFF", fontSize: 18, fontWeight: "bold" }}>Ok</Text>
                </TouchableOpacity>
            ),
            headerTitle: () => (
                <Text style={{
                    fontSize: 18,
                    fontWeight: "bold"
                }}>
                    Perfil
                </Text>
            )
        });
    }, [navigation, dataUpload])

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={120}>
            <ScrollView style={{ backgroundColor: "rgba(255,255,255,0.25)", flex: 1 }}>

                <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: "center" }}
                    onPress={() => navigation.navigate(navigationString.EDIT_PROFILE, auth.currentUser.uid)}
                >
                    <Image source={
                        profileParams.photoURL
                            ? { uri: profileParams.photoURL }
                            : require("../../Data/Default/profileImage.png")
                    } style={styles.profileImage} />
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={styles.defaultText}>{profileParams.userName}</Text>
                    </View>
                    <View style={styles.profileInformation} >
                        <Text style={styles.defaultText}>{profileParams.date} </Text>
                        <Text style={styles.defaultText}>{profileParams.sex}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.imagesContainer}>
                    <Text style={styles.titulo}>Fotos</Text>
                    <View style={styles.imagesSubContainer}>
                        {image.map((item, id) =>
                            image[id] ? (
                                <TouchableOpacity style={styles.imageUser} onPress={() => navigation.navigate(navigationString.SHOWIMAGE, { url: item, aspectRatio: "9:16" })} key={id}>
                                    {image && <Image source={{ uri: item }} style={{ width: "100%", height: "100%" }} key={id} />}
                                    <TouchableOpacity style={styles.deleteContainer} onPress={() => handleEliminarImagen(id)} key={item[id]}>
                                        <MaterialIcons name="cancel" size={24} color="white" />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.imageUser} key={id}>
                                    <TouchableOpacity style={[styles.deleteContainer, { backgroundColor: "white" }]} onPress={() => agregarImagen(id)} key={id}>
                                        <AntDesign name="pluscircleo" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
                    </View>
                </View>
                <View>
                    <Text style={styles.titulo}>Nombre</Text>
                    <TextInput placeholder="Nombre" style={{
                        backgroundColor: "white",
                        width: "100%",
                        minHeight: 35,
                        textAlignVertical: "center",
                        paddingHorizontal: 5,
                        fontWeight: "bold"
                    }}
                        onChangeText={(text) => setTextUserName(text)}
                        value={textUserName}
                    />
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.titulo}>Sobre mi</Text>
                    <TextInput
                        style={{
                            backgroundColor: "white",
                            width: "100%",
                            minHeight: 80,
                            textAlignVertical: "top",
                            paddingHorizontal: 5
                        }}
                        multiline
                        maxLength={maxLength}
                        onChangeText={(text) => setTextInputValue(text)}
                        value={textInputValue}
                    />
                    <Text style={{ position: "absolute", bottom: 0, right: 0, color: "gray", fontSize: 18 }}>{maxLength - textInputValue.length}</Text>
                </View>
            </ScrollView >
        </KeyboardAvoidingView>
    )
}
/*
<Text style={styles.titulo}>Intereses</Text>
<TouchableOpacity style={{ backgroundColor: "white", paddingHorizontal: 10, paddingVertical: 10 }} onPress={() => navigation.navigate(navigationString.ADDGAMES, auth.currentUser.uid)}>
    <Text>Añadir Mis Intereses</Text>
    <AntDesign name="right" size={16} color="black" style={{ right: 10, position: "absolute", bottom: "50%", color: "gray" }} />
</TouchableOpacity>
*/

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
        position: "absolute",
        left: 0,
    },
    nextNavigate: {
        right: 0,
        width: '50%',
        height: '100%',
        position: "absolute"
    },
    buttonsContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: '80%',
        height: '70%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        paddingTop: 10
    },
    imagesContainer: {
        flex: 1,
        width: "100%",
        height: 250,
        padding: 5,
        marginBottom: 10,
    },
    imagesSubContainer: {
        width: "100%",
        height: "85%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    imageUser: {
        width: "30%",
        height: "100%",
        borderWidth: 1,
        borderColor: "gray",
        borderStyle: "dashed",
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    deleteContainer: {
        position: "absolute", right: -5, top: -5, backgroundColor: "black", borderRadius: 15,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    profileInformation: {
        position: "absolute",
        alignItems: "flex-end",
        right: 10,
    },
    defaultText: {
        fontSize: 16,
        fontWeight: "bold",
    }
})