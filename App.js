import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";

const Stack = createStackNavigator();

function Navigations (){
  return (
    <Stack.Navigator defaultScreenOptions={Login} >
      <Stack.Screen name ="Login" component={Login}/>
      <Stack.Screen name ="Signup" component={Signup}/>
      <Stack.Screen name ="Home" component={Home}/>
    </Stack.Navigator>
  )
}

function RootNavigator() {
  return (
    <NavigationContainer>
      <Navigations/>
    </NavigationContainer>
  )
}

export default function App(){
  return <RootNavigator/>
}