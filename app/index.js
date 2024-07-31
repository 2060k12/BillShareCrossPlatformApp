import { useEffect, useContext } from "react";
import { View, Text } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import { AuthContext } from "../contexts/AuthContext";

const HomePage = () => {
  const auth = useContext(AuthContext);
  useEffect(() => {
    // if (auth.currentUser != null) {
    //   router.replace("/(tabs)");
    // }
  }, []);

  return (
    <View>
      <LoginScreen />
    </View>
  );
};
export default HomePage;
