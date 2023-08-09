import React from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationString from "../Constant/navigationString";
import { Forum, GameForum, ForumPost, ShowImage, Coments, ExternalUserProfile } from "../Screens";

const Stack = createNativeStackNavigator();

function ForumStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={navigationString.FORO} component={Forum} />
      <Stack.Screen name={navigationString.GAMEFORO} component={GameForum} />
      <Stack.Screen name={navigationString.FORUMPOST} component={ForumPost} />
      <Stack.Screen name={navigationString.SHOWIMAGE} component={ShowImage} />
      <Stack.Screen name={navigationString.COMENTS} component={Coments} />
      <Stack.Screen name={navigationString.EXTERNALUSERPROFILE} component={ExternalUserProfile} />
    </Stack.Navigator>
  );
}

export default ForumStack;
