import React from "react";
import navigationString from "../Constant/navigationString";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import TabRoutes from "./TabRoutes";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

function DrawerRoutes() {
    const navigation = useNavigation();

    return (
         <Drawer.Navigator
            drawerlockMode="locked-closed"
         >
            <Drawer.Screen name={navigationString.TABS} component={TabRoutes}/>
         </Drawer.Navigator>
    )
};

export default DrawerRoutes;