import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import Repository from "../../data/repository";
import { useRouter } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Pranish Pathak",
    imageUrl:
      "https://images.unsplash.com/photo-1723441857662-d465a52e78d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8", // Default empty image URL
  });
  const repository = new Repository();
  const router = useRouter();

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const userId = "0412524317"; // Replace with the current user's ID
        const userData = await repository.getUserDetails(userId);
        setUser(userData);
      } catch (error) {
        Alert.alert("Error", "Could not fetch user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      const success = await repository.logOut();
      if (success) {
        router.replace("/login/login");
      } else {
        Alert.alert("Something went wrong", "Please try again later.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not log out.");
    }
  };

  const handleOptionPress = (option) => {
    switch (option) {
      case "Contact Us":
        Alert.alert("Contact Us", "Contact support at support@example.com");
        break;
      case "Settings":
        router.push("/settings");
        break;
      case "Notifications":
        router.push("/notifications");
        break;
      default:
        break;
    }
  };

  const handleImagePick = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need permission to access your photo library."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.uri;

      // Update user profile image
      try {
        const userId = "0412524317"; // Replace with the current user's ID
        const imageUrl = await repository.uploadProfileImage(
          userId,
          selectedImageUri
        );

        // Update user profile in Firestore
        await repository.updateUserProfile(userId, { imageUrl });

        // Update state with the new image URL
        setUser((prevUser) => ({
          ...prevUser,
          imageUrl,
        }));
      } catch (error) {
        Alert.alert("Error", "Could not update profile image.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* User Profile Card */}
      <View style={styles.card}>
        <Pressable onPress={handleImagePick}>
          <Image
            source={{ uri: user.imageUrl || "https://via.placeholder.com/100" }}
            style={styles.userImage}
          />
        </Pressable>
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
