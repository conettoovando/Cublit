import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../Data/Firebase";

export default function HomeScreen({navigation}){
    

    return (
        <View style={styles.container}>
            <Text>Email: {auth.currentUser?.email}</Text>
            <Text>Email: {auth.currentUser?.displayName}</Text>
            <TouchableOpacity
                style = {styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: "blue",
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
