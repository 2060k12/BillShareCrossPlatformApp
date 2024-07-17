import { useContext } from "react";
import { Text, View, Alert, TextInput, StyleSheet } from "react-native";
import { FilledButton, OutlinedButton } from "../components/Button";
import { router } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function LoginScreen() {
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
      <View>
        <TextInput placeholder="Email" style={styles.inputText} />
        <TextInput placeholder="Password" style={styles.inputText} />
      </View>

      <View style={styles.buttonsContainer}>
        <FilledButton
          onPress={() => {
            router.push("(tabs)/profile");
            login("iampranish@outlook.com", "123456789");
          }}
        >
          Login
        </FilledButton>
        <OutlinedButton
          onPress={() => {
            register("123@gmail.com", "123456789");
          }}
        >
          Register Now
        </OutlinedButton>
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
