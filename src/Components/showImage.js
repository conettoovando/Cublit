import React, { useEffect, Component } from "react";
import { View, ImageBackground, Dimensions, Text, Image, SafeAreaView } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

let deviceWidth = Dimensions.get("window").width;

const ShowImage = (props) => {
    const aspectRatio = props.route.params.aspectRatio || "4:3"; // Obtén la relación de aspecto de los parámetros o establece un valor predeterminado
    const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number); // Divide la relación de aspecto en ancho y alto numéricos

    const imageHeight = deviceWidth * (aspectHeight / aspectWidth);

    useEffect(() => {
        props.navigation.setOptions({
            headerTintColor: "rgba(255,255,255,1)",
            headerTitle: "",
            headerStyle: {
                backgroundColor: "black",

            }
        })
    })
    const ScaleImg = useSharedValue(1);
    const focoX = useSharedValue(0);
    const focoY = useSharedValue(0);

    const PinchScreen = Gesture.Pinch()
        .onStart((e) => {
            focoX.value = e.focalX;
            focoY.value = e.focalY;
        })

        .onUpdate((e) => {
            ScaleImg.value = e.scale;
        }).onEnd(() => {
            ScaleImg.value = withTiming(1, { duration: 500 })
        });

    const centerImg = {
        x: deviceWidth / 2,
        y: deviceWidth / 2,

    }

    const EstiloAnimado = useAnimatedStyle(() => ({
        transform: [
            { translateX: focoX.value },
            { translateY: focoY.value },
            { translateX: -centerImg.x },
            { translateY: -centerImg.y },
            { scale: ScaleImg.value },
            { translateX: -focoX.value },
            { translateY: -focoY.value },
            { translateX: +centerImg.x },
            { translateY: +centerImg.y },

        ],
    }));

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
            <GestureHandlerRootView>
                <GestureDetector
                    gesture={PinchScreen}
                >
                    <Animated.Image
                        source={props.route.params.url ? { uri: props.route.params.url } : require("../Data/Default/profileImage.png")}
                        style={[{ width: deviceWidth, height: imageHeight }, EstiloAnimado]} // Utiliza el tamaño calculado para la imagen
                    />
                </GestureDetector>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default ShowImage;