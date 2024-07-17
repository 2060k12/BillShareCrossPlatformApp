import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

export function FilledButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.filledButtonuttonContainer}>
      <Text style={styles.filledButtonText}>{children}</Text>
    </Pressable>
  );
}

export function OutlinedButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.outlinedButtonContainer}>
      <Text style={styles.outlinedButtonText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filledButtonuttonContainer: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: "black",
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  filledButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
  },
  outlinedButtonContainer: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  outlinedButtonText: {
    textAlign: "center",
    color: "black",
    fontSize: 24,
  },
});
