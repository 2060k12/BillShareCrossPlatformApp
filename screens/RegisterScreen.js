import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilledButton, OutlinedButton } from "../components/Button";
import * as InputField from "../components/InputField";
import * as Notifications from "expo-notifications";
import LoginRepository from "../data/LoginRepository";

export default function RegisterScreen({ onPress }) {
  // const [visible, setVisible] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const repository = new LoginRepository();
  function registerNow() {
    repository.register(name, phoneNumber, email, password, (success) => {
      if (success) {
        onPress();
      } else {
        console.log("Failed");
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
              onChangeText={(text) => setpassword(text)}
            >
              Password
            </InputField.PasswordField>
          </View>
        </View>
        <View>
          <FilledButton onPress={() => registerNow()}>Register</FilledButton>
          <OutlinedButton onPress={onPress}>Back</OutlinedButton>
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
