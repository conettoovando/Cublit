import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { auth } from "../../Data/Firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { loadImageFromGallery } from "../../utils/helpers";
import {
  uploadImage,
  updateProfilefun,
  updateFireData,
  getProfileData,
} from "../../utils/actions";
import { Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SelectList } from "react-native-dropdown-select-list";
import navigationString from "../../Constant/navigationString";

export default function ProfileConfiguration({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerLargeTitle: false,
      headerTitle: "Configurar Perfil",
      headerTitleStyle: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        alignSelf: "center",
      },
    });
  }, [navigation]);

  const user = auth.currentUser;
  const [email, setEmail] = useState(user.email);
  const [userName, setUserName] = useState(user.displayName);
  const [photoUrl, setPhotoUrl] = useState(user.photoURL);
  const [uid, setUid] = useState(user.uid);
  const [TextIInformation, setTextInformation] = useState();

  const [selected, setSelected] = React.useState("");
  const [defaultSelected, setDefaultSelected] = React.useState("");

  const data = [
    { key: "0", value: "Masculino" },
    { key: "1", value: "Femenino" },
    { key: "2", value: "Otro" },
    { key: "3", value: "Prefiero no decirlo" },
  ];

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      const result = await getProfileData();
      setTextInformation(result.informacionPerfil);
      setSelected(result.sex);
      setDate(result.date);
      data.forEach((element) => {
        if (element.value === result.sex) {
          setDefaultSelected({ key: element.key, value: element.value });
          return;
        }
      });
    };
    fetchProfileData();
  }, []);

  const dateProfileUser = {
    userName: userName ?? null,
    photoURL: photoUrl ?? null,
    date: date ?? null,
    sex: selected ?? null,
    informacionPerfil: TextIInformation ?? null,
    uid: uid,
  };

  const callFireDatafunction = async () => {
    const dataName = "users";
    await updateFireData(dataName, dateProfileUser).then(() => {
      navigation.navigate(navigationString.PROFILE, { param: "reload" });
    });
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    const formatDate =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    setDate(formatDate);
    hideDatePicker();
  };
  const changePhoto = async () => {
    const result = await loadImageFromGallery([1, 1]);
    if (!result.status) {
      return;
    }
    const resultUploadImage = await uploadImage(
      result.image,
      "ProfileImage",
      user.uid
    );
    if (!resultUploadImage.status) {
      alert("Error al subir la imagen");
      return;
    }

    const resultUpdateProfile = await updateProfilefun({
      photoURL: resultUploadImage.url,
    });
    if (resultUpdateProfile.status) {
      setPhotoUrl(resultUploadImage.url);
    } else {
      Alert.alert("Ha ocurrido un error al actualizar la imagen");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.subcontainer}>
        <View
          style={{
            width: "100%",
            borderColor: "#BBBBBB",
            borderWidth: 1,
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => changePhoto()}>
              <Image
                style={styles.imageProfile}
                source={
                  user.photoURL
                    ? { uri: photoUrl }
                    : require("../../Data/Default/profileImage.png")
                }
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{ textAlign: "center", fontSize: 16, fontWeight: 500 }}
              >
                Nombre de usuario
              </Text>
              <TextInput style={styles.TextInputRow}>
                <Text style={{}}>{userName}</Text>
              </TextInput>
            </View>
          </View>
          <View style={{ marginLeft: "10%" }}>
            <TouchableOpacity onPress={() => changePhoto()}>
              <Text style={{ color: "blue" }}>Cambiar foto</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Escribe sobre ti!"
            placeholderTextColor="gray"
            multiline={true}
            numberOfLines={3}
            onChangeText={(text) => {
              if (text.split("\n").length <= 3) {
                setTextInformation(text);
              } else {
                setTextInformation(text.split("\n").slice(0, 3).join("\n"));
              }
            }}
            value={TextIInformation}
          />
        </View>
        <View style={{ marginTop: "3%", width: "80%", paddingLeft: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 300 }}>
            Correo electronico
          </Text>
        </View>
        <TouchableOpacity style={styles.configurationContainer}>
          <Text style={{ paddingLeft: 5 }}>{email}</Text>
        </TouchableOpacity>
        <View style={{ marginTop: "3%", width: "80%", paddingLeft: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 300 }}>Sexo</Text>
        </View>
        <View style={{ width: "80%" }}>
          <SelectList
            data={data}
            setSelected={(val) => setSelected(val)}
            save="value"
            search={false}
            placeholder="Seleccionar opcion"
            defaultOption={defaultSelected}
            boxStyles={{
              borderWidth: 1,
              borderColor: "black",
              alignItems: "center",
              paddingBottom: 5,
              paddingTop: 5,
              borderRadius: 25,
              paddingLeft: 10,
            }}
          />
        </View>
        <View style={{ marginTop: "3%", width: "80%", paddingLeft: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 300 }}>
            Fecha nacimiento
          </Text>
        </View>
        <TouchableOpacity
          style={styles.configurationContainer}
          onPress={() => showDatePicker()}
        >
          <Text style={{ color: date ? "black" : "gray", paddingLeft: 5 }}>
            {date ? date : "dd/mm/YYYY"}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          locale="es_CL"
          maximumDate={new Date()}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => callFireDatafunction()}
        >
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  subcontainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#E99D42",
    width: 200,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  title: {
    padding: 10,
    fontSize: 30,
    width: "100%",
    textAlign: "center",
  },
  imageProfile: {
    width: 110,
    height: 110,
    borderRadius: 200 / 2,
  },
  TextInputRow: {
    width: 200,
    backgroundColor: "#F0F0F0",
    padding: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 20,
  },
  TextInput: {
    width: "90%",
    backgroundColor: "#F0F0F0",
    borderRadius: 30,
    padding: 10,
    margin: 5,
  },
  textInput: {
    textAlign: "left",
    width: "80%",
    fontSize: 20,
  },
  textAreaContainer: {
    borderColor: "#BBBBBB",
    borderWidth: 1,
    padding: 10,
    width: "100%",
    height: 100, // ajustar al tamaño deseado
  },
  textArea: {
    justifyContent: "flex-start",
    textAlignVertical: "top",
    maxHeight: 100, // ajustar al tamaño deseado
  },
  configurationContainer: {
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
    justifyContent: "center",
    borderRadius: 15,
  },
});
