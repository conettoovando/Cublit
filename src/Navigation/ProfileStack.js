import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationStrings from "../Constant/navigationString";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../Components/CustomDrawer";
import {
  Profile,
  EditProfile,
  Preferences,
  PostDetails,
  HomeNewPost,
  ShowImage,
  Coments,
} from "../Screens";

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name={navigationStrings.PROFILE} component={Profile} />
      <Stack.Screen
        name={navigationStrings.EDIT_PROFILE}
        component={EditProfile}
      />
      <Stack.Screen name={navigationStrings.PREF} component={Preferences} />
      <Stack.Screen
        name={navigationStrings.POSTDETAILS}
        component={PostDetails}
      />
      <Stack.Screen
        name={navigationStrings.HOME_NEW_POST}
        component={HomeNewPost}
      />
      <Stack.Screen
        name={navigationStrings.SHOWIMAGE}
        component={ShowImage}
      />
      <Stack.Screen
        name={navigationStrings.COMENTS}
        component={Coments}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
