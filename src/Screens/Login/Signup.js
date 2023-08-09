import { StackActions } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, database } from "../../Data/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import navigationString from "../../Constant/navigationString";
import credenciales from "../../Constant/credentials";

export default function Signup() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Registro"
    })
  }, [navigation])

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  const [username, setUsername] = useState("");

  const onHandleSignUp = () => {
    if (
      email !== "" &&
      password !== "" &&
      username !== "" &&
      confpassword !== ""
    ) {
      if (password !== confpassword) {
        Alert.alert("Error", "Password and Confirm Password do not match");
        return;
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredentials) => {
            // Redirigir a la pantalla "Pref"
            credenciales.obtenerAccessToken();
            navigation.reset({
              index: 0,
              routes: [{ name: navigationString.PREF }],
            });
            const user = userCredentials.user;
            const userRef = doc(database, "users", user.uid);
            await setDoc(userRef, {
              email: user.email,
              userName: username,
              realName: "",
              photoURL: null,
              date: null,
              preferences: [],
              friends: [],
              matchCreate: false
            });
            await updateProfile(user, {
              displayName: username,
            });
          })
          .catch((err) => Alert.alert("Error", err.message));
      }
    }
  };

  return (
    <KeyboardAwareScrollView>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.inputcontainer}>
          <Text style={styles.Title}>Cublit</Text>

          <TextInput
            placeholder="example@email.com"
            style={styles.inputText}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="User Name"
            style={styles.inputText}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            placeholder="password"
            style={styles.inputText}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm Password"
            style={styles.inputText}
            value={confpassword}
            onChangeText={(text) => setConfPassword(text)}
            secureTextEntry
          />
          <StatusBar style="auto" />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onHandleSignUp}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  inputcontainer: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  Title: {
    fontSize: 80,
    color: "#000",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    color: "gray",
  },
  inputText: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    width: "80%",
    height: 50,
    marginTop: 20,
    borderRadius: 30,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#00FFFF",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
});
