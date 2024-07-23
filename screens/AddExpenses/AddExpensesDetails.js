import { router, useNavigation } from "expo-router";
import { useState, useContext } from "react";
import { Button, View, Text } from "react-native";
import InputField from "../../components/InputField";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import Repository from "../../data/repository";

const AddExpensesDetails = () => {
  const repository = new Repository();

  // when the add button is pressed
  async function addExpenses() {
    await repository.addExpenses(amount, details, (success) => {
      if (success) {
        router.push("(tabs)");
      }
    });
  }

  const db = useContext(FirestoreContext);
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");

  const nav = useNavigation();
  nav.setOptions({
    headerShown: true,
    title: "Add Expences",
    headerRight: () => <Button onPress={addExpenses} title="Add" />,
  });
  return (
    <View
      style={{
        margin: 16,
      }}
    >
      <Text>Selected People: Pranish, John Doe</Text>
      <InputField enteredText={amount} onChangeText={(text) => setAmount(text)}>
        Add Amount
      </InputField>
      <InputField
        enteredText={details}
        onChangeText={(text) => setDetails(text)}
      >
        Details
      </InputField>
    </View>
  );
};

export default AddExpensesDetails;
