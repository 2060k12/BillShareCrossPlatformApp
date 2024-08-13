import React from "react";
import { View, Text, StyleSheet, Pressable, Alert, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Repository from "../../data/repository";
import { useRouter } from "expo-router";

export default function Profile() {
  const repository = new Repository();
  const router = useRouter();

  // Example user data
  const user = {
    name: "John Doe",
    imageUrl: "https://via.placeholder.com/100", // Placeholder image URL
  };

  const handleLogout = () => {
    repository.logOut((success) => {
      if (success) {
        router.replace("/login/login");
      } else {
        Alert.alert("Something went wrong", "Please try again later.");
      }
    });
  };

  const handleOptionPress = (option) => {
    switch (option) {
      case "Contact Us":
        Alert.alert("Contact Us", "Contact support at support@example.com");
        break;
      case "Settings":
        router.push("/settings"); // Navigate to settings screen
        break;
      case "Notifications":
        router.push("/notifications"); // Navigate to notifications screen
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* User Profile Card */}
      <View style={styles.card}>
        <Image source={{ uri: user.imageUrl }} style={styles.userImage} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {["Contact Us", "Settings", "Notifications"].map((option) => (
          <Pressable
            key={option}
            style={styles.optionButton}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
            <MaterialIcons name="navigate-next" size={24} color="black" />
          </Pressable>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
          <MaterialIcons name="logout" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  card: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  logoutContainer: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 24,
    marginRight: 8,
  },
});
