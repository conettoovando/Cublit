import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import navigationString from "../Constant/navigationString"
import TabRoutes from "./TabRoutes"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                screenOptions={{headerShown: false}}
            >
                <Stack.Screen component={AuthStack} name = {navigationString.LOGIN}/>
                <Stack.Screen component={TabRoutes} name = {navigationString.HOME}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

import Example from "./Example";

function RoutesTest() {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                screenOptions={{headerShown: false}}
            >
                <Stack.Screen component={Example} name = "example"/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routes;