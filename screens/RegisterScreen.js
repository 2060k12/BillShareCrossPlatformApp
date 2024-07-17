import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilledButton, OutlinedButton } from "../components/Button";
import InputField from "../components/InputField";

export default function RegisterScreen({ onPress }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
            <InputField
              enteredText={name}
              onChangeText={(text) => setName(text)}
            >
              Full Name
            </InputField>
            <InputField
              enteredText={email}
              onChangeText={(text) => setEmail(text)}
            >
              Email
            </InputField>
            <InputField
              enteredText={password}
              onChangeText={(text) => setpassword(text)}
            >
              Phone Number
            </InputField>
            <InputField
              enteredText={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
            >
              Password
            </InputField>
          </View>
        </View>

        <View>
          <FilledButton onPress={onPress}>Register</FilledButton>
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
