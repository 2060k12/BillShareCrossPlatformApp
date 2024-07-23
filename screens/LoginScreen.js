import { useContext, useState } from "react";
import { Text, View, Alert, StyleSheet, SafeAreaView } from "react-native";
import { FilledButton, OutlinedButton } from "../components/Button";
import { router } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import RegisterScreen from "./RegisterScreen.js";
import * as InputField from "../components/InputField.js";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  // state of register page
  const [registerPageView, setregisterPageView] = useState(false);

  const auth = useContext(AuthContext);

  async function login(email, password, success) {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (credencials) => {
          success(true);
          console.log(credencials.user.email);
        }
      );
    } catch (e) {
      success(false);
      console.log(e);
    }
  }
  return (
    <SafeAreaView>
      <Text>Login to Continue</Text>
      <View style={styles.buttonsContainer}>
        <InputField.EmailField
          enteredText={email}
          onChangeText={(text) => setEmail(text)}
        >
          Email
        </InputField.EmailField>

        <InputField.PasswordField
          enteredText={password}
          onChangeText={(text) => setpassword(text)}
        >
          Password
        </InputField.PasswordField>
      </View>

      <View style={styles.buttonsContainer}>
        <FilledButton
          onPress={async () => {
            // router.replace("(tabs)/profile");
            await login(email, password, (success) => {
              if (success) {
                router.replace("(tabs)");
              } else {
                Alert.alert("Something Went Wrong");
              }
            });
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
    </SafeAreaView>
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
