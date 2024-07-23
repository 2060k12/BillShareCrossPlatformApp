import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Repository from "../../data/repository";
import { useRouter } from "expo-router";

export default function Profile() {
  const repository = new Repository();
  const router = useRouter();

  const handleLogout = () => {
    repository.logOut((success) => {
      if (success) {
        router.replace("/login/login");
      } else {
        Alert.alert("Something went wrong", "Please try again later.");
      }
    });
  };

  return (
    <View style={styles.logoutContainer}>
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logOutText}>Log Out</Text>
        <MaterialIcons name="logout" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logOutText: {
    fontSize: 24,
    marginRight: 8,
  },
});
