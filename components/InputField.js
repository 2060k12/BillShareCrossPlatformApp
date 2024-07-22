import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

export default function InputField({ children, enteredText, onChangeText }) {
  return (
    <View>
      <TextInput
        value={enteredText}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        placeholderTextColor="grey"
        placeholder={children}
        style={styles.inputText}
      />
    </View>
  );
}

export function EmailField({ children, enteredText, onChangeText }) {
  return (
    <View>
      <TextInput
        keyboardType="email-address"
        clearButtonMode="while-editing"
        autoComplete="email"
        secureTextEntry={false}
        value={enteredText}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        placeholderTextColor="grey"
        placeholder={children}
        style={styles.inputText}
      />
    </View>
  );
}

export function PasswordField({ children, enteredText, onChangeText }) {
  return (
    <View>
      <TextInput
        clearButtonMode="while-editing"
        autoComplete="password"
        secureTextEntry={true}
        value={enteredText}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        placeholderTextColor="grey"
        placeholder={children}
        style={styles.inputText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputText: {
    padding: 8,
    fontSize: 20,

    marginVertical: 4,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
});
