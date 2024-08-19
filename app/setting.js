import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Repository from "../data/repository"; // Adjust the path accordingly

export default function SettingsScreen() {
  const { user } = useLocalSearchParams();
  const router = useRouter();

  const parsedUser = typeof user === "string" ? JSON.parse(user) : user;

  if (!parsedUser || typeof parsedUser !== "object") {
    console.error("User data is undefined or not an object");
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>User data is not available.</Text>
      </SafeAreaView>
    );
  }

  const [name, setName] = useState(parsedUser.name || "");
  const [email, setEmail] = useState(parsedUser.email || "");
  const [phoneNumber] = useState(parsedUser.phoneNumber || "");
  const [loading, setLoading] = useState(false); // New loading state

  const repository = new Repository();

  const handleSave = async () => {
    console.log("Save button pressed");
    if (!name || !email) {
      Alert.alert("Error", "Name and Email fields are required.");
      return;
    }
    setLoading(true); // Set loading to true when save starts

    try {
      // Update user profile
      await repository.updateUserProfile(parsedUser.phoneNumber, {
        name,
        email,
      });

      Alert.alert("Success", "Your profile has been updated!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false when save ends
    }
  };

  const handleEdit = (field, value, setValue) => {
    console.log(`Edit ${field} button pressed`);
    Alert.prompt(
      `Edit ${field}`,
      `Enter your ${field.toLowerCase()}:`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (text) => setValue(text),
        },
      ],
      "plain-text",
      value
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.headerText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Pressable
          style={styles.card}
          onPress={() => handleEdit("Name", name, setName)}
        >
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.editButton}>Edit</Text>
          </View>
          <Text style={styles.value}>{name}</Text>
        </Pressable>
        <Pressable
          style={styles.card}
          onPress={() => handleEdit("Email", email, setEmail)}
        >
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.editButton}>Edit</Text>
          </View>
          <Text style={styles.value}>{email}</Text>
        </Pressable>
        <View style={styles.card}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{phoneNumber}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" /> // Show loading indicator
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: "#007BFF",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  editButton: {
    fontSize: 16,
    color: "#007BFF",
  },
  buttonContainer: {
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    elevation: 2,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
