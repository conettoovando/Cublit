import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView} from "react-native";
import { StackActions } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase";

export default function Login ({ navigation }){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    useEffect(() =>{
        auth.onAuthStateChanged(user =>{
            if (user){
                navigation.dispatch(StackActions.popToTop());
                navigation.dispatch(StackActions.replace('Home'));
            }
        })
    })
    
    const onHandleLogin = () => {
        if (email !== "" && password !== ""){
            signInWithEmailAndPassword(auth, email, password)
            .then(() => console.log("Login success"))
            .catch((err) => Alert.alert("Login error", err.message))
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>        
            <View style={styles.inputcontainer}>
                <Text style={styles.Title}>Cublit</Text>
                <Text style={styles.subTitle}>Sign in to your account</Text>
                <TextInput placeholder="example@email.com" 
                    style={styles.inputText}
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput placeholder="password" 
                    style={styles.inputText}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                <StatusBar style="auto" />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style = {styles.button} onPress={onHandleLogin}>
                    <Text style = {styles.buttonText} >Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text style = {{marginTop: 15, color:"gray",fontSize:12}}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style = {{marginTop: 10, color:"gray",fontSize:12}}>don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")} >
                    <Text style = {{marginTop: 10, color:"blue",fontSize:12}}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor : '#f1f1f1',
        alignItems: "center",
        justifyContent: "center",
    },
    inputcontainer: {
        width:"100%",
        backgroundColor : '#f1f1f1',
        alignItems: "center",
        justifyContent: "center",
    },
    Title: {
        fontSize: 80,
        color: "#000",
        fontWeight: "bold",
    },
    subTitle: {
        fontSize : 20,
        color : "gray",
    },
    inputText: {
        borderWidth : 1,
        borderColor : "gray",
        padding: 10,
        width: '80%',
        height: 50,
        marginTop: 20,
        borderRadius: 30,
    },
    buttonContainer:{
        width: '60%',
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    button:{
        backgroundColor : "#00FFFF",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "black",
        fontWeight: '700',
        fontSize: 16,
    }
})