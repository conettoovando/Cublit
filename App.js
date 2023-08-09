import React from "react";
import { View } from "react-native";
import Routes from "./src/Navigation/Routes";
import 'react-native-gesture-handler';

const App = () => {

  return (
    <View style={{ flex: 1 }}>
      <Routes />
    </View>
  );
}

export default App;