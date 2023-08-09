import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationString from "../Constant/navigationString";
import {Notifications} from "../Screens";

const Stack = createNativeStackNavigator();

function NotificationsStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name={navigationString.NOTIFICATIONS} component={Notifications}/>
        </Stack.Navigator>
    );
}

export default NotificationsStack;