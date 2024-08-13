import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilledButton, OutlinedButton } from "../components/Button";
import * as InputField from "../components/InputField";
import * as Notifications from "expo-notifications";
import LoginRepository from "../data/LoginRepository";

export default function RegisterScreen({ onPress }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const repository = new LoginRepository();

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhoneNumber(phoneNumber) {
    const re = /^0\d{9}$/;
    return re.test(phoneNumber);
  }

  function registerNow() {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        "Phone number should start with 0 and be 10 digits long."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    repository.register(name, phoneNumber, email, password, (success) => {
      setLoading(false);
      if (success) {
        onPress();
      } else {
        Alert.alert("Registration Failed", "Please try again later.");
      }
    });
  }

  return (
    <Modal
      onRequestClose={onPress}
      animationType="slide"
      presentationStyle="pageSheet"
      visible={true}
    >
      <View style={styles.modelContainer}>
        <View>
          <View style={styles.pageHeaderContainer}>
            <Text style={styles.pageHeader}>Register Now</Text>
          </View>
          <View>
            <InputField.default
              enteredText={name}
              onChangeText={(text) => setName(text)}
            >
              Full Name
            </InputField.default>
            <InputField.default
              enteredText={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
            >
              Phone Number
            </InputField.default>
            <InputField.EmailField
              enteredText={email}
              onChangeText={(text) => setEmail(text)}
            >
              Email
            </InputField.EmailField>
            <InputField.PasswordField
              enteredText={password}
              onChangeText={(text) => setPassword(text)}
            >
              Password
            </InputField.PasswordField>
            <InputField.PasswordField
              enteredText={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            >
              Confirm Password
            </InputField.PasswordField>
          </View>
        </View>
        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <>
              <FilledButton onPress={() => registerNow()}>
                Register
              </FilledButton>
              <OutlinedButton onPress={onPress}>Back</OutlinedButton>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    backgroundColor: "#cccccc",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
  },
  pageHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  pageHeaderContainer: {
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: "black",
    borderRadius: 5,
  },
});
