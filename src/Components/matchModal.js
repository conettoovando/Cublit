import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import navigationString from "../Constant/navigationString";

/*
<Text>Hola mundo</Text>
                    
*/
export default function MatchAlert({ isVisible = null, onClose = null, userData = null, navigation = null }) {
    const photoImage = userData?.myProfileImage
    return (
        <Modal animationType="none" transparent={true} visible={isVisible}>
            <BlurView intensity={100} style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={styles.centerContents}>
                        <View style={styles.ImagesContainer}>
                            <View style={{ justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 10 }}>
                                <Image source={{ uri: photoImage }} style={styles.imageProfile} />
                                <View style={{ justifyContent: "center" }}>
                                    <View style={{ backgroundColor: "blue", borderRadius: 45 }}>
                                        <Ionicons name="game-controller" size={50} color="white" style={styles.icon} />
                                    </View>
                                </View>
                                <Image source={{ uri: userData?.Images[0] }} style={styles.imageProfile} />
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.Title}>MatchGame!🚀</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton} onPressIn={() => navigation.navigate(navigationString.MATCHCHATS)}>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Continuar</Text>
                                <View style={{ top: "25%", right: 10, position: "absolute" }}>
                                    <AntDesign name="right" size={22} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    centerContainer: {
        padding: 5,
        backgroundColor: "#8E3CE0",
        height: "70%",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "rgba(0,0,0,0.7)",
        justifyContent: "center"
    },
    centerContents: {
        height: "80%",
        alignItems: "center",
    },
    ImagesContainer: {
        width: "100%",
        height: "50%",
        justifyContent: "center"
    },
    imageProfile: {
        width: 110,
        height: 110,
        borderRadius: 200 / 2,
        borderWidth: 1,
        borderColor: "black"
    },
    icon: {
        padding: 10,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: "black",
    },
    textContainer: {
        width: "100%",
        height: "50%",
        alignItems: "center"
    },
    Title: {
        fontSize: 35,
        fontWeight: "bold"
    },
    closeButton: {
        backgroundColor: "cyan",
        width: "50%",
        height: "20%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: "5%",
        borderWidth: 1,
        borderColor: "#ccc"
    }
})