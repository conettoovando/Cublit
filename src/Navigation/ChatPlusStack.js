import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationString from "../Constant/navigationString";
import { Chat, ChatplusHome, ExternalUserProfile, ShowImage, FriendsRequest, ChatPlus, MatchProfile, EditProfile, MatchChats, AddGames } from "../Screens";

const Stack = createNativeStackNavigator();

function ChatPlusStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name={navigationString.CHATPLUSHOME} component={ChatplusHome} />
            <Stack.Screen name={navigationString.CHAT} component={Chat} />
            <Stack.Screen name={navigationString.CHATPLUS} component={ChatPlus} />
            <Stack.Screen name={navigationString.EXTERNALUSERPROFILE} component={ExternalUserProfile} />
            <Stack.Screen name={navigationString.SHOWIMAGE} component={ShowImage} />
            <Stack.Screen name={navigationString.FRIENDSREQUEST} component={FriendsRequest} />
            <Stack.Screen name={navigationString.CHATPLUSPROFILE} component={MatchProfile} />
            <Stack.Screen name={navigationString.EDIT_PROFILE} component={EditProfile} />
            <Stack.Screen name={navigationString.MATCHCHATS} component={MatchChats} />
            <Stack.Screen name={navigationString.ADDGAMES} component={AddGames} />
        </Stack.Navigator>
    );
}

export default ChatPlusStack;