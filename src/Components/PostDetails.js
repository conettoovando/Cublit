import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { ProfileUserQuery } from "../utils/Querys";
import { Image } from "expo-image";
import moment from "moment-timezone";

function PostDetails(id) {
  const post = id.route.params;
  const { width } = useWindowDimensions();

  const fecha = post.dateTime.toDate();
  const fechaChile = moment.tz(fecha, "America/Santiago");
  const formattedDate = fechaChile.format("DD/MM/YYYY");
  console.log(post)

  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{post.title}</Text>
        </View>
        <View style={[styles.autorContainer, {}]}>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={
                  post.userPhotoURL
                    ? { uri: post.userPhotoURL }
                    : require("../Data/Default/profileImage.png")
                }
                style={{ width: 40, height: 40, borderRadius: 25 }}
                contentFit="cover"
              />
              <View style={{ padding: 5 }}>
                <Text
                  style={[
                    styles.defaultText,
                    {
                      borderWidth: 1,
                      paddingHorizontal: 5,
                      borderRadius: 10,
                    },
                  ]}
                >
                  {post.userName}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              height: "100%",
              flex: 1,
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <View
              style={{
                minwidth: "30%",
                maxWidth: "100%",
              }}
            ></View>
            <Text
              style={[
                styles.defaultText,
                { borderWidth: 1, paddingHorizontal: 10, borderRadius: 10 },
              ]}
            >
              {formattedDate}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            paddingVertical: 5,
            borderColor: "rgba(0,0,0,0.3)",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Categorias:
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingRight: 5 }}>#</Text>
            <TouchableOpacity>
              <Text
                style={[
                  {
                    borderWidth: 1,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    color: "rgba(0,0,0,1)",
                    borderColor: "rgba(0,0,0,0.4)",
                  },
                ]}
              >
                {post.category}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10, paddingTop: 15 }}>
          <RenderHTML
            tagsStyles={tagsStyles}
            source={{ html: post.content }}
            contentWidth={width}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default PostDetails;

const styles = StyleSheet.create({
  titleContainer: {
    padding: 10,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: 46,
    fontWeight: "800",
    fontStyle: "italic",
  },
  autorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: 5,
    paddingTop: 15,
  },
  defaultText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

const tagsStyles = {
  img: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 10,
    borderWidth: 1,
  },
  div: {
    fontSize: 16,
  },
};
