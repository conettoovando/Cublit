import React from "react";
import navigationString from "../Constant/navigationString";
import TabRoutes from "./TabRoutes";

export default function (Stack){
    return (
        <>
            <Stack.Screen name = {navigationString.HOME} component = {TabRoutes}/>
        </>
    )
}