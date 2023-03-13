import react, {useState} from "react";
import { View, Text, StyleSheet,TextInput} from "react-native";
import { auth, storage } from "../../Data/Firebase";
import { useFonts } from "expo-font";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableNativeFeedback } from "react-native-web";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from "firebase/auth";
import {Storage} from "../../Data/Firebase";

export default function Profile ({navigation}) {
    const [image, setImage] = useState(null);


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
    });
        if (!result.cancelled){
            const ImageUrl  = result.uri;
        auth.currentUser.updateProfile({photoURL: ImageUrl}); {/* = (result.assets[0].uri);*/}
            
        }
        console.log(auth.currentUser.photoURL)
    };
    email = auth.currentUser?.email;
    userName = auth.currentUser?.displayName;
     
    console.log(storage.ref("gs://cublit.appspot.com/"))
    {/* Session Out */}
    const onHandleLogout = () => {
        auth.signOut()
        .then(() => {
            navigation.replace("Login")
        }).catch(error => alert(error.message))
    }

    return (
        <KeyboardAwareScrollView
            style={{flex:1}}
            contentContainerStyle={{
                justifyContent:"center",
                alignItems:"center",
                backgroundColor: "red",
            }}
        >
            <View style={styles.subcontainer}>
                <Text style={styles.title}>profile</Text>
                <View style={{flexDirection:'row', justifyContent:"center", alignItems:"center"}}>
                    <Image 
                        style = {styles.imageProfile}
                        source= {auth.currentUser.photoURL}
                    />
                    <View style={{marginTop: 40}}>
                        <Text style={{textAlign:"center", fontSize:16,fontWeight:500, fontFamily:"cheese_Smile"}}>Nombre de usuario</Text>
                        <TextInput style = {styles.TextInputRow}>
                            <Text style= {styles.text}>{userName}</Text>
                        </TextInput>
                    </View>
                </View>
                <View style={{position:"relative",marginRight:"55%",marginBottom:20}}>
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={{color:"blue"}}>Change Image</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.textInput}>Nombre</Text>
                <TextInput style = {styles.TextInput}>
                    <Text style= {styles.text}>{email}</Text>
                </TextInput>
                <Text style={styles.textInput}>Correo electronico</Text>
                <TextInput style = {styles.TextInput}>
                    <Text style= {styles.text}>{email}</Text>
                </TextInput>
                <Text style={styles.textInput}>Teléfono</Text>
                <TextInput style = {styles.TextInput}>
                    <Text style= {styles.text}>{email}</Text>
                </TextInput>
                <Text style={styles.textInput}>Sexo</Text>
                <TextInput style = {styles.TextInput}>
                    <Text style= {styles.text}>{email}</Text>
                </TextInput>
                <Text style={styles.textInput}>Fecha nacimiento</Text>
                <TextInput style = {styles.TextInput}>
                    <Text style= {styles.text}>{email}</Text>
                </TextInput>
                <View>
                    <TouchableOpacity
                    style = {styles.button}
                    onPress= {onHandleLogout}
                    >
                        <Text style={styles.buttonText}>Sign out</Text>
                    </TouchableOpacity>
                </View>
            
            {/* continue code here.. */}
            
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "blue",
        width: 200,
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

    subcontainer: {
        width: "100%",
        height: "100%",
        flexDirection:"column",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
    },

    title : {
        fontSize: 30,
        width: "100%",
        textAlign: "center",
        backgroundColor: "yellow",
        
    },
    imageProfile: {
        width: 110,
        height: 110,
        borderRadius: 100,
    },
    TextInputRow: {
        width: 200,
        backgroundColor: "#F0F0F0",
        borderRadius: 30,
        padding: 10,
        margin: 5,
    },
    TextInput: {
        width: "90%",
        backgroundColor: "#F0F0F0",
        borderRadius: 30,
        padding: 10,
        margin: 5,
    },
    textInput:{
        textAlign: "left",
        width: "80%",
        fontSize: 20,
        fontFamily:"cheese_Smile",
    },
});
