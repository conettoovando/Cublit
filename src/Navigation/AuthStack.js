import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationString from "../Constant/navigationString";
import {Login, Singup, Preferences,Home} from "../Screens";

const Stack = createNativeStackNavigator();

function AuthStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name={navigationString.LOGIN+"Stack"} component={Login}/>
            <Stack.Screen name={navigationString.SIGNUP} component={Singup}/>
            <Stack.Screen name={navigationString.PREF} component={Preferences}/>
        </Stack.Navigator>
    );
}

export default AuthStack;