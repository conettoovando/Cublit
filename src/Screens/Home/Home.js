import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
  Linking
} from "react-native";
import { Link, useNavigation } from "@react-navigation/native";
import navigationString from "../../Constant/navigationString";
import { PostDisplayerForPreferences } from "../../utils/Querys";
import moment from "moment-timezone";
import RenderHTML from "react-native-render-html";
import { auth, database } from "../../Data/Firebase";
import credenciales from "../../Constant/credentials";
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, getDocs, collection, query, where, limit } from "firebase/firestore";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

function Home({ navigation }) {
  const [appLoad, setAppLoad] = useState(true)
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerLargeTitle: false,
      headerTitle: "Cublit",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate(navigationString.HOME_NEW_POST)}
          style={{
            backgroundColor: "blue",
            width: 30,
            height: 30,
            borderRadius: 10,
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const user = auth.currentUser;

  useEffect(() => {
    fetchData()
    fetchSearchResultsOnceAWeek()
  }, []);

  const fetchSearchResultsOnceAWeek = async (categories) => {
    let response = [];
    const lastFetchDate = await AsyncStorage.getItem("lastFetchDate");

    const currentDate = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (!lastFetchDate || currentDate - new Date(lastFetchDate) > oneWeek) {
      const arrayResults = [];
      const searchTerm = "Beneficios de videojuegos de";
      const apiKey = "AIzaSyCGCrR4RuODUJzj0o3BzjSj4FR9XGFzy14"

      for (const category of categories) {
        const random = Math.floor(Math.random() * 1000);
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=304caf394f67547db&q=${encodeURIComponent(
          searchTerm + " " + category
        )}&num=2&&random=${random}`;

        const response = await axios.get(url);
        arrayResults.push(response.data);
      }

      await AsyncStorage.setItem("lastFetchDate", currentDate.toISOString());
      await AsyncStorage.setItem("searchResults", JSON.stringify(arrayResults));
    }

    const cachedResults = await AsyncStorage.getItem("searchResults");
    for (const item of JSON.parse(cachedResults)) {
      response.push(...item.items);
    }
    return response;
  };

  const fetchData = async () => {
    const response = await PostDisplayerForPreferences();
    const webData = await fetchSearchResultsOnceAWeek(response);
    if (!webData) {
      return;
    }
    if (!response) {
      return;
    }

    const userRef = collection(database, "Posts");

    const q = query(userRef, where("category", "in", response), limit(10));

    const snapshot = await getDocs(q);
    const postsData = [];
    let cont = 0;
    for (const docs of snapshot.docs) {
      const PostData = docs.data();
      const documentUid = docs.id;
      const userDocRef = doc(database, 'users', PostData.uid);
      const userDoc = await getDoc(userDocRef);
      const userJson = userDoc.data();
      PostData.documentUid = documentUid;
      PostData.userPhotoURL = userJson.photoURL;
      postsData.push(PostData);
      cont++;
      if (webData.length > 0) {
        if (cont % 2 === 0) {
          postsData.push({
            type: "web",
            link: webData[0].link,
            title: webData[0].title,
            snippet: webData[0].snippet,
            image: webData[0].pagemap.cse_image ? webData[0].pagemap.cse_image[0].src : null,
          });
          webData.splice(0, 1);
        }
      }
    }
    if (webData.length > 0) {
      for (const item of webData) {
        postsData.push({
          type: "web",
          link: item.link,
          title: item.title,
          snippet: item.snippet,
          image: item.pagemap.cse_image ? item.pagemap.cse_image[0].src : null,
        });
      }
    }
    setFilterData(postsData);
  };

  const { width } = useWindowDimensions();
  const RenderHTMLMemo = React.memo(RenderHTML);

  const handleLike = async (post) => {
    const currentLikeStatus = !post.likes_by_users.includes(auth.currentUser.uid);

    const postRef = doc(database, 'Posts', post.documentUid);
    await updateDoc(postRef, {
      likes_by_users: currentLikeStatus ? arrayUnion(auth.currentUser.uid) : arrayRemove(auth.currentUser.uid),
    });

    setFilterData((prevData) =>
      prevData.map((item) => {
        if (item.documentUid === post.documentUid) {
          return { ...item, likes_by_users: currentLikeStatus ? [...item.likes_by_users, auth.currentUser.uid] : item.likes_by_users.filter((uid) => uid !== auth.currentUser.uid) };
        }
        return item;
      })
    );
  };

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("error al abrir la direccion: " + url)
    }
  }

  return (
    <>
      <ScrollView>
        {filterData.length > 0 ?
          filterData.map((item, index) => {
            if (item.type === "web") {
              return (
                <View style={styles.container} key={index}>
                  <View style={styles.itemContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}>
                      <Image
                        source={
                          item.userPhotoURL
                            ? { uri: item.userPhotoURL }
                            : require("../../Data/Default/CublitLogo.png")
                        }
                        style={styles.image}
                      />
                      <Text style={styles.textName}>Cublit</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => openLink(item.link)
                    }
                  >
                    <View style={styles.postContainer}>
                      <View style={{}}>
                        <Text style={styles.titleText}>{item.title}</Text>
                      </View>
                      <View style={styles.contenidoContainer}>
                        <Text>{item.snippet}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {
                    item.image ? (
                      <TouchableOpacity style={{ borderWidth: 1, borderColor: "#ccc" }} onPress={() => navigation.navigate(navigationString.SHOWIMAGE, { url: item.image })}>
                        <Image style={{ width: "100%", height: width }} source={{ uri: item.image }} resizeMode="cover" />
                      </TouchableOpacity>
                    ) : null
                  }
                </View>
              )
            } else {
              return (
                <View style={styles.container} key={index}>
                  <View style={styles.itemContainer}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                      onPress={() => navigation.navigate(navigationString.EXTERNALUSERPROFILE, item.uid)}
                    >
                      <Image
                        source={
                          item.userPhotoURL
                            ? { uri: item.userPhotoURL }
                            : require("../../Data/Default/profileImage.png")
                        }
                        style={styles.image}
                      />
                      <Text style={styles.textName}>{item.userName}</Text>
                    </TouchableOpacity>
                    <View>
                      <Text>
                        {moment
                          .tz(item.dateTime.toDate(), "America/Santiago")
                          .format("DD/MM/YYYY")}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(navigationString.POSTDETAILS, item)
                    }
                  >
                    <View style={styles.postContainer}>
                      <View style={{}}>
                        <Text style={styles.titleText}>{item.title}</Text>
                      </View>
                      <View style={styles.containerCategories}>
                        <Text style={styles.textCategories}>{item.category}</Text>
                      </View>
                      <View style={styles.contenidoContainer}>
                        <RenderHTMLMemo
                          baseStyle={{
                            overflow: "hidden",
                            height: 40,
                          }}
                          tagsStyles={{
                            img: {
                              display: "none",
                            },
                          }}
                          source={{ html: item.content }}
                          contentWidth={width}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                    <View style={{ flexDirection: "row", marginRight: 10, alignItems: "center" }}>
                      <TouchableOpacity style={{ marginRight: 5 }} onPress={() => handleLike(item)}>
                        {item.likes_by_users.includes(auth.currentUser.uid) ? (
                          <AntDesign name="heart" size={24} color="red" />
                        ) : (
                          <Feather name="heart" size={24} color="black" />
                        )}
                      </TouchableOpacity>
                      <Text>{item.likes_by_users.length}</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }} onPress={() => navigation.navigate(navigationString.COMENTS, item)}>
                      <Feather name="message-circle" size={24} color="black" style={{ marginRight: 5 }} />
                      <Text>{Object.values(item.coments_by_users).length}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              );
            }

          }) : <ActivityIndicator size="large" color="#0000ff" />}

      </ScrollView >

    </>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "#BBBBBB",
    padding: 5,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(0,0,0,0.4)",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  textName: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: 600,
  },

  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  containerCategories: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 5,
  },
  textCategories: {
    marginRight: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#BBBBBB",
    borderRadius: 8,
    color: "rgba(0,0,0,0.4)",
  },
  contenidoContainer: {
    width: "100%",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#BBBBBB",
  },
  textContenido: {
    marginTop: 5,
    fontSize: 15,
  },
});
