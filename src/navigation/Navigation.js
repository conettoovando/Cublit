import React, { Profiler } from "react";
import { Text, TouchableOpacity} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons'; 
import { createStackNavigator } from "@react-navigation/stack";


// Screens

//HomeScreen
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import Profile from "../screens/HomeScreen/Profile";
//Login
import Login from "../screens/Login/Login";
import Signup from "../screens/Login/Signup";

const LoginStack = createStackNavigator();

function LoginStackScreen() {
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen name="Login" component={Login} />
            <LoginStack.Screen name="Signup" component={Signup} />
            <LoginStack.Screen name="HomeScreen" component={MyTabs} options={{headerShown: false}} />
        </LoginStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: "gray",
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} 
                options={{
                    headerShown: true,
                    headerRight: () => (
                        <AntDesign name="search1" size={24} color="gray" style={{marginRight: 10}} onPress={() => alert('This is a button!')}/>
                    ),
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={24} color="gray" />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={Profile} 
                options={{
                    headerTitle: () => (
                        <TouchableOpacity onPress = {() => alert("Hello world")}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Profile</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <AntDesign name="search1" size={24} color="gray" style={{marginRight: 10}} onPress={() => alert('This is a button!')}/>
                    ),
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="profile" size={24} color="gray" />
                    ),
                }}
                
            />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <LoginStackScreen/>
        </NavigationContainer>
    );
}