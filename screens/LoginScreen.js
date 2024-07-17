import { useContext, useState } from "react";
import { Text, View, Alert, TextInput, StyleSheet } from "react-native";
import { FilledButton, OutlinedButton } from "../components/Button";
import { router } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import RegisterScreen from "./RegisterScreen.js";
import InputField from "../components/InputField.js";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  // state of register page
  const [registerPageView, setregisterPageView] = useState(false);

  const auth = useContext(AuthContext);
  function register(email, password) {
    try {
      createUserWithEmailAndPassword(auth, email, password).then(
        Alert.alert(auth?.user?.email)
      );
    } catch (error) {
      console.log(error);
    }
  }

  function login(email, password) {
    try {
      signInWithEmailAndPassword(auth, email, password).then((credencials) =>
        console.log(credencials.user.email)
      );
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <View>
      <Text>Login to Continue</Text>
      <View style={styles.buttonsContainer}>
        <InputField enteredText={email} onChangeText={(text) => setEmail(text)}>
          Email
        </InputField>

        <InputField
          enteredText={password}
          onChangeText={(text) => setpassword(text)}
        >
          Password
        </InputField>
      </View>

      <View style={styles.buttonsContainer}>
        <FilledButton
          onPress={() => {
            router.replace("(tabs)/profile");
            // router.push("(tabs)/profile");
            login(email, password);
          }}
        >
          Login
        </FilledButton>
        <OutlinedButton
          onPress={() => {
            setregisterPageView(true);
          }}
        >
          Register Now
        </OutlinedButton>
        {registerPageView && (
          <RegisterScreen onPress={() => setregisterPageView(false)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputText: {
    padding: 8,
    fontSize: 20,
    marginHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  buttonsContainer: {
    marginHorizontal: 16,
  },
});
