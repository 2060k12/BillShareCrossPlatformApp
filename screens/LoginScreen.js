import { useContext, useState } from "react";

import {
  Image,
  Text,
  View,
  Alert,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { FilledButton, OutlinedButton } from "../components/Button";
import { router } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import RegisterScreen from "./RegisterScreen.js";
import * as InputField from "../components/InputField.js";

export default function LoginScreen() {
  // state of email and password
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  // state of register page
  const [registerPageView, setregisterPageView] = useState(false);

  // state for loading indicator
  const [loading, setLoading] = useState(false);

  const auth = useContext(AuthContext);

  async function login(email, password, success) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (credentials) => {
          success(true);
          console.log(credentials.user.email);
        }
      );
    } catch (e) {
      success(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.image} />
      <Text style={styles.title}>Login to Continue,</Text>

      <View style={styles.inputContainer}>
        <InputField.EmailField
          enteredText={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        >
          Email
        </InputField.EmailField>

        <InputField.PasswordField
          enteredText={password}
          onChangeText={(text) => setpassword(text)}
          style={styles.input}
        >
          Password
        </InputField.PasswordField>
      </View>

      <View style={styles.buttonsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <>
            <FilledButton
              onPress={async () => {
                await login(email, password, (success) => {
                  if (success) {
                    router.replace("(tabs)");
                  } else {
                    Alert.alert("Something Went Wrong");
                  }
                });
              }}
              style={styles.filledButton}
            >
              Login
            </FilledButton>
            <OutlinedButton
              onPress={() => {
                setregisterPageView(true);
              }}
              style={styles.outlinedButton}
            >
              Register Now
            </OutlinedButton>
          </>
        )}
        {registerPageView && (
          <RegisterScreen onPress={() => setregisterPageView(false)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",

    paddingHorizontal: 16,
    marginTop: 16,
  },
  inputContainer: {
    margin: 16,
  },
  input: {
    padding: 12,
    fontSize: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  buttonsContainer: {
    marginHorizontal: 16,
  },
  filledButton: {
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  outlinedButton: {
    borderColor: "#6200ee",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },

  image: {
    width: 400,
    height: 300,
    borderRadius: 20,
    alignSelf: "center",
  },
});
