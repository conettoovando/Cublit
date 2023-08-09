import * as React from "react";
import { Text, Modal, View, TouchableOpacity, Button, StyleSheet, Animated } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import navigationString from "../Constant/navigationString";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../Data/Firebase";

export function navigate({ route }) {
    const navigation = useNavigation();
    MyModal.setIsModalOpen(!isModalOpen);
    navigation.navigate(route);
}

export default function MyModal({ isModalOpen, isDarkMode, setIsModalOpen, title, content }) {
    const navigation = useNavigation();

    const modalContainerStyle = {
        flex: 1,
        justifyContent: "flex-end", // Ajusta el contenido en el centro verticalmente
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    };
    const modalStyle = {
        backgroundColor: isDarkMode ? '#000' : 'white',
        alignItems: "center",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: "95%", // Ajusta el tamaño máximo del modal
        paddingHorizontal: 5,
        paddingTop: 20, // Ajusta el espacio vertical dentro del modal
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingBottom: 40,
    }

    const titleStyle = {
        color: isDarkMode ? 'white' : 'black',
        fontSize: 20,
        fontWeight: 'bold',
    }

    return (
        <>
            <Modal visible={isModalOpen} transparent={true} animationType="slide">
                <View style={modalContainerStyle}>
                    <View style={modalStyle}>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "#BBBBBB", paddingBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 10 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <Text style={titleStyle}>{title}</Text>
                            </View>
                            <TouchableOpacity style={{ alignSelf: "center", paddingLeft: 10 }} onPress={() => setIsModalOpen(!isModalOpen)}>
                                <AntDesign name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        {content}
                    </View>
                </View>
            </Modal>
        </>
    )
}

