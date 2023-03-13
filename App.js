import Navigation from './src/navigation/Navigation';
import { useFonts } from "expo-font";

export default function App() {
  const [fonstLoaded] = useFonts({
    cheese_Smile: require("./src/Styles/fonts/Cheese-Smile.ttf"),
  });

  return (
    <Navigation/>
  );
}


