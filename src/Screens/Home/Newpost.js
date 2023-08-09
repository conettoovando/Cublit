import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import moment from "moment-timezone";
import { auth } from "../../Data/Firebase";
import { loadImageFromGallery } from "../../utils/helpers";
import { manipulateAsync } from "expo-image-manipulator";
import {
  uploadImage,
  createPostFireData,
  DelteImages,
} from "../../utils/actions";
import * as cheerio from "cheerio";
import { end, filter } from "cheerio/lib/api/traversing";
import { Alert } from "react-native";
import { Timestamp } from "firebase/firestore";
import credenciales from "../../Constant/credentials";
import { ResquestApis } from "../../utils/Querys";

// Code
const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H2</Text>
);

const imagesUrls = {};

export default function NewPost({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerLargeTitle: false,
      headerTitle: "Nueva Publicación",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#FFFFFF",
        elevation: 0,
      },
      headerTintColor: "#000000",
      headerTitleStyle: {
        fontSize: 20,
      },
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={async () => {
            const response = await DelteImages(allUrlsPost);
            if (response.status) {
              navigation.goBack();
            }
          }}
        >
          <Text style={{ fontSize: 16, color: "#000000" }}>Cancelar</Text>
        </TouchableOpacity>
      ),
    });
    getPreferences();
  }, [navigation]);
  const fechaActual = moment().tz("America/Santiago").format("DD/MM/YYYY");

  //user information
  const userData = auth.currentUser;
  const [userName, setUserName] = useState(userData.displayName);

  //post information
  const [TitlePost, setTitlePost] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [data, setData] = useState([]);

  /*const data = [
    { key: 0, value: "Juegos Generales" },
    { key: 1, value: "Accion" },
    { key: 2, value: "Estrategia" },
    { key: 3, value: "Rol" },
    { key: 4, value: "Simulacion" },
    { key: 5, value: "Aventura" },
    { key: 6, value: "Deportes" },
  ];*/

  const getPreferences = async () => {
    let url = "https://api.igdb.com/v4/genres";
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
    let newPreferences = [{ key: 0, value: "Juegos Generales" }]
    data.map((item, index) => {
      newPreferences.push({ key: index + 1, value: item.name });
    });
    setData(newPreferences);
  };

  const [PublicationText, setPublicationText] = useState("");
  const [newPublication, setNewPublication] = useState("");
  const richText = React.useRef();

  const SelectImage = async () => {
    const result = await loadImageFromGallery([1, 1]);
    if (!result.status) {
      return;
    } else {
      convertBase64(result.image, imagesUrls);
    }
  };

  const convertBase64 = async (image, imagesUrls) => {
    try {
      const manipulatedImage = await manipulateAsync(
        image,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 1, format: "jpeg", base64: true }
      );
      const imageData = `data:image/jpeg;base64,${manipulatedImage.base64}`;
      richText.current?.insertImage(imageData);
      imagesUrls[imageData] = image;
    } catch (error) {
      console.log(error);
    }
  };
  const postStructure = {
    title: TitlePost,
    category: categorySelected,
    content: PublicationText,
    uid: userData.uid,
    userName: userData.displayName,
    coments_by_users: [],
    likes_by_users: [],

  };

  const subirImagenes = async (imgFile) => {
    const response = { status: false, url: "" };
    const resultUploadImage = await uploadImage(
      imgFile,
      "PostImages",
      `${userData.uid}-${Date.now()}`
    );
    if (resultUploadImage.status) {
      response.status = true;
      response.url = resultUploadImage.url;
    } else {
      response.status = resultUploadImage.status;
    }

    return response;
  };

  const createPost = async (diccionario) => {
    const response = {
      status: null,
      imgContents: null,
      diccUrls: {},
    };
    if (Object.keys(diccionario).length > 0) {
      try {

        const promises = Object.keys(diccionario).map(async (key) => {
          const responeUploadImages = await subirImagenes(diccionario[key]);
          if (responeUploadImages.status) {
            response.diccUrls[key] = responeUploadImages.url;
            response.status = true;
            response.imgContents = true;
          } else {
            Alert.alert("Error", "No se pudieron subir las imagenes");
            response.status = false;
            response.imgContents = false;
          }
        });

        await Promise.all(promises);
      } catch (error) {
        response.status = false;
        response.imgContents = false;
      }
    } else {
      response.status = true;
      response.imgContents = false;
    }

    return response;
  };

  const remplazarRutas = async (publicacion, diccionario) => {
    const response = { status: false, Post: null };
    const imgTags = publicacion.match(/<img.*?src="(.*?)".*?>/g);
    if (imgTags) {
      await Promise.all(
        imgTags.map(async (imgTag) => {
          const ruta = imgTag.match(/<img.*?src="(.*?)".*?>/)[1];
          if (diccionario[ruta]) {
            publicacion = publicacion.replace(ruta, diccionario[ruta]);
          }
        })
      );
      response.Post = publicacion;
      response.status = true;
    }
    return response;
  };

  const getImageFromHTML = async (publication, imagesUrls) => {
    const response = { status: false, newPost: null };
    const $ = cheerio.load(publication);
    const imgTags = $("img");
    const imgUrls = imgTags.map((index, imgTag) => $(imgTag).attr("src")).get();
    const crearPost = await createPost(imagesUrls);
    if (crearPost.status && crearPost.imgContents) {
      const NewPost = await remplazarRutas(
        publication,
        crearPost.diccUrls,
        imgUrls
      );
      if (NewPost.status) {
        response.status = true;
        response.newPost = NewPost.Post;
      } else {
        response.status = false;
      }
    }
    if (crearPost.status && !crearPost.imgContents) {
      response.status = true;
      response.newPost = publication;
    }
    return response;
  };

  const allUrlsPost = {
    urlsPost: [],
    name: "PostImages/",
  };

  const savePost = async (post) => {
    if (TitlePost === "" || categorySelected === "" || PublicationText === "") {
      alert("Faltan campos por llenar");
    } else {
      const response = await getImageFromHTML(post.content, imagesUrls);
      if (response.status) {
        post.content = response.newPost;
        createPostFireData("Posts", post, post.uid).then((response) => {
          if (response.status) {
            alert("Publicación creada");
            navigation.goBack();
          } else {
            alert("Error al crear la publicación");
          }
        });
      }
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={styles.alertContainer}>
            <View
              style={{
                backgroundColor: "rgba(199,192,0,0.76)",
                width: "100%",
                padding: 10,
                paddingRight: 30,
                flexDirection: "row",
                borderEndColor: "black",
                borderWidth: 1,
              }}
            >
              <Text style={{ fontSize: 26 }}>⚠ </Text>
              <Text style={{ fontSize: 14, color: "white" }}>
                Este apartado esta destinado unicamente a publicaciones
                dedidacas al uso beneficioso de los videojuegos
              </Text>
            </View>
          </View>
          <Text style={styles.TituleInput}>Titulo</Text>
          <TextInput
            style={[styles.TextInput, { width: "90%" }]}
            placeholder="Titulo"
            onChangeText={setTitlePost}
          />
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              paddingTop: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.TextInput,
                { marginRight: 10, paddingHorizontal: 10 },
              ]}
            >
              {userName}
            </Text>
            <Text
              style={[
                styles.TextInput,
                { marginRight: 10, paddingHorizontal: 10 },
              ]}
            >
              {fechaActual}
            </Text>
          </View>
          <View style={{ width: "90%", paddingTop: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <SelectList
                data={data}
                setSelected={(val) => setCategorySelected(val)}
                save="value"
                search={false}
                placeholder="Categoria"
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
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, marginTop: 10 }}
        >
          <Text>Publicación:</Text>
          <ScrollView usecontainer={true} style={{ flex: 1 }}>
            <RichEditor
              androidLayerType="hardware"
              disabled={false}
              initialContentHTML=""
              ref={richText}
              placeholder={"Description"}
              onChange={(text) => {
                setPublicationText(text);
              }}
              style={{ minHeight: "100%" }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <View>
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertBulletsList,
              actions.insertImage,
              actions.heading2,
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
            ]}
            onPressAddImage={() => SelectImage()}
            iconMap={{
              [actions.heading2]: handleHead,
            }}
          />
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        style={{
          backgroundColor: "black",
          padding: 10,
          borderRadius: 10,
          margin: 10,
          width: "70%",
          alignSelf: "center",
        }}
        onPress={() => savePost(postStructure)}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Publicar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  alertContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  TituleInput: {
    paddingLeft: 10,
    justifyContent: "center",
    width: "90%",
    fontWeight: "bold",
    fontSize: 20,
  },
  TextInput: {
    padding: 5,
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 15,
  },
  blockInformation: {
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
