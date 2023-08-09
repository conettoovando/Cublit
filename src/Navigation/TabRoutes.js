import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import navigationString from "../Constant/navigationString";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import ForumStack from "./ForumStack";
import ChatPlusStack from "./ChatPlusStack"
import NotificationsStack from "./NotificationStack";
import { useEffect, useState } from "react";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabRoutes() {
    const navigation = useNavigation();

    return (
        <Tab.Navigator
            initialRouteName={navigationString.HOME + "Stack"}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'rgba(0, 0, 0, 1)',
                tabBarInactiveTintColor: "rgba(0, 0, 0, 0.5)",
                tabBarShownLabel: false,
                unmountOnBlur: true,
            }
            }
        >
            <Tab.Screen
                name={navigationString.HOME + "Stack"}
                component={HomeStack}

                options={({ route }) => ({
                    tabBarLabel: navigationString.HOME,
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
                        if (routeName != navigationString.HOME) {
                            return { display: "none" }
                        }
                        return
                    })(route),
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={size} />
                    ),
                })}
            />
            <Tab.Screen
                name={navigationString.FORO + "Stack"}
                component={ForumStack}
                options={({ route }) => ({
                    tabBarLabel: navigationString.FORO,
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Foro';
                        if (routeName != navigationString.FORO) {
                            return { display: "none" }
                        }
                        return
                    })(route),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-circle" size={size} color={color} />
                    ),
                })}
            />
            <Tab.Screen
                name={navigationString.CHATPLUSHOME + "Stack"}
                component={ChatPlusStack}
                options={({ route }) => ({
                    tabBarLabel: "Chat",
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? navigationString.CHATPLUSHOME;
                        if (routeName != navigationString.CHATPLUSHOME) {
                            return { display: "none" }
                        }
                        return
                    })(route),
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="forum" color={color} size={size} />
                    ),
                })}
            />
            {/*
            <Tab.Screen
                name={navigationString.NOTIFICATIONS + "Stack"}
                component={NotificationsStack}
                options={{
                    tabBarLabel: navigationString.NOTIFICATIONS,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="bell" color={color} size={size} />
                    ),
                }}
            />*/}
            <Tab.Screen
                name={navigationString.PROFILE + "Stack"}
                component={ProfileStack}
                options={({ route }) => ({
                    tabBarLabel: navigationString.PROFILE,
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? navigationString.PROFILE;
                        if (routeName != navigationString.PROFILE) {
                            return { display: "none" }
                        }
                        return
                    })(route),
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account" color={color} size={size} />
                    ),
                })}
            />
        </Tab.Navigator>
    )
};

export default TabRoutes;