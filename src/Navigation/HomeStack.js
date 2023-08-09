import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationStrings from "../Constant/navigationString";
import { Home, HomeNewPost, PostDetails, Coments, ExternalUserProfile, ShowImage } from "../Screens";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name={navigationStrings.HOME} component={Home} />
      <Stack.Screen
        name={navigationStrings.HOME_NEW_POST}
        component={HomeNewPost}
      />
      <Stack.Screen
        name={navigationStrings.POSTDETAILS}
        component={PostDetails}
      />
      <Stack.Screen
        name={navigationStrings.COMENTS}
        component={Coments}
      />
      <Stack.Screen name={navigationStrings.EXTERNALUSERPROFILE} component={ExternalUserProfile} />
      <Stack.Screen name={navigationStrings.SHOWIMAGE} component={ShowImage} />
    </Stack.Navigator>
  );
}
