import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, TextInput, Dimensions, useWindowDimensions, Alert } from "react-native";
import { auth } from "../../Data/Firebase";
import { Image } from "expo-image";
import { FontAwesome5 } from '@expo/vector-icons';
import { loadImageFromGallery } from "../../utils/helpers";
import { createPostFireData, uploadImage } from "../../utils/actions";
import navigationString from "../../Constant/navigationString";

function ForumPost(navigation) {
    const gameName = navigation.route.params;
    const user = auth.currentUser;
    const viewRef = useRef(null);
    const [viewHeight, setViewHeight] = useState(0);
    const [textAreaPost, setTextAreaPost] = useState("");
    const [Images, setImages] = useState([]);

    const handleLayout = () => {
        viewRef.current.measure((x, y, width, height) => {
            setViewHeight(height);
        });
    };

    useEffect(() => {
        navigation.navigation.setOptions({
            headerLargeTitle: false,
            headerTitle: "Crear publicacion",
            headerRight: () => (
                <TouchableOpacity onPress={() => Publicar(textAreaPost, Images)}>
                    <Text>Publicar</Text>
                </TouchableOpacity>
            )
        });
    }, [navigation, Images, textAreaPost]);
    const PickImage = async () => {
        if (Images.length >= 1) {
            Alert.alert("Solo puedes agregar una imagen")
        } else {
            const response = await loadImageFromGallery([1, 1]);
            if (response.status) {
                const newImages = [...Images, response.image]
                setImages(newImages)
            } else {
                Alert.alert("No se pudo cargar la imagen")
            }
        }

    }
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    const DeleteImage = async (name) => {
        const updatedImages = Images.filter((image) => image !== name);
        setImages(updatedImages);
    }


    const Publicar = async (Post = null, Images = null) => {
        const result = { status: false, error: null, urls: null };
        if (Images) {
            const ImagesURLS = [];
            const randomString = (length) => {
                let result = "";
                const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            };

            const generateRandomName = (extension) => {
                const imageName = extension.split("/").pop();

                const randomName = randomString(8); // Genera una cadena de 8 caracteres aleatorios
                return `${randomName}${imageName}`;
            };

            if (Images.length > 0) {
                const uploadPromises = Images.map(async (index) => {
                    const name = generateRandomName(index);
                    const response = await uploadImage(index, "ForumImages", name);
                    if (response.status) {
                        ImagesURLS.push(response.url);
                    }
                });

                await Promise.all(uploadPromises);
            }
            const Data = {
                userName: user.displayName,
                gameName: gameName,
                postText: textAreaPost,
                Images: ImagesURLS,
                coments_by_users: [],
                likes_by_users: [],
                uid: user.uid
            }
            const responseUploadPost = await createPostFireData("ForumPost", Data)
            if (responseUploadPost.status) {
                Alert.alert("Publicacion creada con exito 😃🚀")
                navigation.navigation.goBack();
            }
        }
    };


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "rgba(255,255,255,1)" }}>
            <View style={{ flexDirection: "row", padding: 10 }} onLayout={handleLayout} ref={viewRef}>
                <Image
                    style={styles.profileImage}
                    source={
                        user.photoURL
                            ? { uri: user.photoURL }
                            : require("../../Data/Default/profileImage.png")}
                />
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 20 }}>{user.displayName}</Text>
                    <Text style={styles.gameName}>{gameName}</Text>
                </View>
            </View>
            <View style={styles.textInputContainer}>
                <TextInput
                    editable
                    multiline
                    maxLength={100}
                    onChangeText={(text) => {
                        setTextAreaPost(text);
                    }}
                    value={textAreaPost}
                    style={[styles.textInput, { minHeight: Dimensions.get('screen').height - viewHeight * 10 }]}
                    placeholder="Escribe tu publicación..."
                />
            </View>
            {Images.length > 0 ?
                Images.map((index, N) => (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 5 }} key={N}>
                        <Image source={{ uri: index }} style={{ width: "100%", height: 400 }} />
                        <TouchableOpacity style={styles.closeButtonContainer} onPress={() => DeleteImage(index)}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                )) : ("")
            }
            <View style={{ height: 50, padding: 5, justifyContent: "center", alignItems: "center", borderTopWidth: 1, borderColor: "#ccc" }}>
                <TouchableOpacity style={{ flexDirection: "row", borderWidth: 1, padding: 5, width: "60%" }} onPress={() => PickImage()}>
                    <FontAwesome5 name="images" size={26} color="black" />
                    <Text style={{ fontSize: 16, marginLeft: "10%" }}>Agregar Imagen</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    );
}

export default ForumPost;

const styles = StyleSheet.create({
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 200 / 2,
    },
    gameName: {
        borderWidth: 1,
        textAlign: "center",
        borderRadius: 5,
        ...Platform.OS === "ios" && {
            borderRadius: 5,
        },
    },
    textInputContainer: {
        backgroundColor: "rgba(255,255,255,1)",
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    textInput: {
        textAlignVertical: "top",
        padding: 5,
        paddingHorizontal: 10,
    },
    closeButtonContainer: {
        position: "absolute",
        top: 0,
        right: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 25,
    },
    closeButtonText: {
        color: "rgba(125, 125, 125, 1)",
        fontSize: 20,
    },
});
