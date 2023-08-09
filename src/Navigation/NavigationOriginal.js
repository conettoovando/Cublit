import React, {useContext, useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator, useDrawerStatus} from "@react-navigation/drawer";
import { Dimensions } from "react-native";
import CustomDrawer from "../Components/CustomDrawer";


//Screens
import Login from "../Screens/Login/Login";
import Signup from "../Screens/Login/Signup";
import Pref from "../Screens/Login/preferences";
import HomeScreen from "../Screens/Home/Home";
import Profile from "../Screens/Home/Profile";
import Notifications from "../Screens/Home/Notifications"
import Chatplus from "../Screens/Home/Chatplus"
import Forum from "../Screens/Home/Forum"

//homeScreen
import NewPost from "../Screens/Home/HomeScreen/Newpost";

//Profile Screen
import ProfileConf from "../Screens/Home/Profile/configurarPerfil";
import preferencesConf from "../Screens/Home/Profile/PreferencesConf";

import { TouchableOpacity } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Main() {
    return (
        
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: true}}
        >
            <Tab.Screen 
                name="Chatplus"
                component={Chatplus}
                options={{
                    title: "Chat+",
                    tabBarIcon:({size, color}) => {
                        <MaterialCommunityIcons name="Home" size={size} color={color}/>
                    }
                }}
            />
            <Tab.Screen 
                name="Forum"
                component={Forum}
                options={{
                    title: "Foro",
                    tabBarIcon:({size, color}) => {
                        <MaterialCommunityIcons name="Home" size={size} color={color}/>
                    }
                }}
            />
            <Tab.Screen 
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Home",
                    tabBarIcon:({size, color}) => {
                        <MaterialCommunityIcons name="Home" size={size} color={color}/>
                    }
                }}
            />
            <Tab.Screen 
                name="Notifications"
                component={Notifications}
                options={{
                    title: "Notificaciones",
                    tabBarIcon:({size, color}) => {
                        <MaterialCommunityIcons name="Home" size={size} color={color}/>
                    }
                }}
            />
            <Tab.Screen 
                name="Prof"
                component={ProfileNavigation}
                options={{
                    title: "Profile",
                    tabBarIcon:({size, color}) => {
                        <MaterialCommunityIcons name="details" size={size} color={color}/>
                    },
                    headerShown:false
                }}
                
            />
        </Tab.Navigator>
    );
}

function ProfileNavigation() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props}/>}
            drawerPosition="right"
            screenOptions={{
                headerShown: true,
                headerLeft: () => null,
                drawerPosition:"right",
                tabBarVisible: false,
            }}
        >
            <Drawer.Screen name="Profile" component={Profile} />
        </Drawer.Navigator>
    );
}

function Navigate(props){
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
                <Stack.Screen name="Pref" component={Pref} options={{headerShown: true}}/>
                <Stack.Screen name="HomeScreen" component={Main} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigate;
