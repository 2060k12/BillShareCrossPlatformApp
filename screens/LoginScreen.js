import React from "react";
import { Text, View, Alert, TextInput, StyleSheet } from "react-native";
import { FilledButton, OutlinedButton } from "../components/Button";

export default function LoginScreen() {
  return (
    <View>
      <Text>Login to Continue</Text>

      <View>
        <TextInput placeholder="Email" style={styles.inputText} />
        <TextInput placeholder="Password" style={styles.inputText} />
      </View>

      <View style={styles.buttonsContainer}>
        <FilledButton onPress={() => Alert.alert("Login")}>Login </FilledButton>
        <OutlinedButton onPress={() => Alert.alert("Register Now")}>
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
