import React from "react";
import { View, StyleSheet} from "react-native";
import { Drawer } from "react-native-paper";

const Drawer = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    return (
        <Drawer.Section>
            <Drawer.Item
                label="First Item"
                onPress={() => { }}
            />
        </Drawer.Section>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Drawer;
