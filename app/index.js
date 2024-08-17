import { useEffect, useContext } from "react";
import { View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import { AuthContext } from "../contexts/AuthContext";

const HomePage = () => {
  const auth = useContext(AuthContext);
  useEffect(() => {}, []);

  return (
    <View>
      <LoginScreen />
    </View>
  );
};
export default HomePage;
