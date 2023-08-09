import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import { auth } from "../../Data/Firebase";
import { doc, updateDoc, collection, getDoc } from "firebase/firestore";
import { database } from "../../Data/Firebase";
import { useNavigation } from "@react-navigation/native";
import navigationString from "../../Constant/navigationString";
import { ResquestApis } from "../../utils/Querys";
import credenciales from "../../Constant/credentials";
import { ScrollView } from "react-native-gesture-handler";

export default function Preferences() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [checkboxOptions, setcheckboxOptions] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Preferencias"
    })
  }, [navigation])

  /*const checkboxOptions = [
    { label: "Accion", value: false },
    { label: "Estrategia", value: false },
    { label: "Rol", value: false },
    { label: "Carreras", value: false },
    { label: "Simulacion", value: false },
    { label: "Aventura", value: false },
    { label: "Deportes", value: false },
    // Agregar aquí más opciones de checkbox
  ];*/

  useEffect(() => {
    getPreferences();
  }, [])

  const getPreferences = async () => {
    let url = "https://api.igdb.com/v4/genres";
    if (credenciales.ACCESSTOKEN === "" || credenciales.ACCESSTOKEN == null) {
      await credenciales.obtenerAccessToken()
    }
    let options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": credenciales.CLIENTID,
        Authorization: `Bearer ${credenciales.ACCESSTOKEN}`,
      },
      body: `fields name;
      limit 100;`,
    };
    const response = await ResquestApis(url, options);
    const data = response.data;
    let newPreferences = []
    data.map((item) => {
      newPreferences.push({ label: item.name, value: false });
    });
    setcheckboxOptions(newPreferences);
  };

  const [selectedValues, setSelectedValues] = useState(
    checkboxOptions.reduce((obj, option) => {
      console.log(option)
      obj[option.label] = option.value;
      return obj;
    }, {})
  );

  useEffect(() => {
    QueryPreferences();
  }, []);

  const QueryPreferences = async () => {
    const userRef = doc(database, "users", user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (userData.preferences === null) {
      setSelectedValues(
        checkboxOptions.reduce((obj, option) => {
          obj[option.label] = option.value;
          return obj;
        }, {})
      );
    } else {
      setSelectedValues(userData.preferences);
    }
  };

  const handleCheckboxChange = (label) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [label]: !prevSelectedValues[label],
    }));
  };

  const savePreferences = async () => {
    const userRef = doc(database, "users", user.uid);
    await updateDoc(userRef, { preferences: selectedValues })
      .then(() => navigation.replace(navigationString.HOME));
  };


  return (
    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.paragraph}>Selecciona tus preferencias</Text>
        <View>
          {checkboxOptions.map((option) => (
            <View key={option.label} style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={selectedValues[option.label]}
                onValueChange={() => handleCheckboxChange(option.label)}
              />
              <Text style={styles.label}>{option.label}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={savePreferences} style={styles.button}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 32,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },

  button: {
    backgroundColor: "blue",
    width: 200,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
