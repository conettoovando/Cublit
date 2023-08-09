import React, {useState,} from "react";
import {View, Text, useColorScheme, Button} from "react-native";
import MyModal from "../Components/Modal";
import { SafeAreaView } from "react-native-safe-area-context";

function Example() {
    const isDarkMode = useColorScheme() === 'dark';
    const [isModalOpen, setIsModalOpen] = useState(false);

    const backgroundStyle = {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDarkMode ? '#000' : '#fff',
    }

    const TextStyle = {
        color: isDarkMode ? 'white' : 'black',
        fontSize: 20,
        fontWeight: 'bold',
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <Text style={TextStyle}>Modal</Text>
            <Button title="Open Modal" onPress={() => setIsModalOpen(!isModalOpen)}/>
            <MyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        </SafeAreaView>
    )
}

export default Example