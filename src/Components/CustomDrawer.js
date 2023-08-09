import React, { useEffect } from "react";
import {View, Text, TouchableOpacity, StyleSheet, Modal} from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { onHandleLogout } from "../utils/actions";
import navigationString from "../Constant/navigationString";

const CustomDrawer = () => {
    const navigation = useNavigation();

    return (
        <View style={{flex:1,
            backgroundColor:"#fff",
            justifyContent:"space-between",
            alignItems:"center"
        }}>
            <DrawerContentScrollView scrollEnabled={false}>
                <View style={{justifyContent:"center", alignItems:"center", padding:20, borderBottomColor:"#ccc", borderBottomWidth:1}}>
                    <Text style={{fontSize:26}}>Configuracion</Text>
                </View>
                <View style={styles.contianer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.replace(navigationString.EDIT_PROFILE)}>
                        <Text style={styles.buttonText}>Configurar Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.replace(navigationString.PREF)}>
                        <Text style={styles.buttonText}>Configurar Preferencias</Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
            <View style={{justifyContent:"center", alignItems:"center", padding:40}}>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => onHandleLogout(navigation)}>
                        <Text style={styles.buttonText}>Cerrar sesion</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

styles = StyleSheet.create({
    contianer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    button: {
        backgroundColor: "#E99D42",
        width: 200,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },

    buttonText: {
        color: 'white',
        fontWeight: '700',
    },
})

export default CustomDrawer
