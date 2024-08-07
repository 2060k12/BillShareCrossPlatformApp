import { router, useNavigation } from "expo-router";
import { useState, useContext, useEffect } from "react";
import {
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import InputField from "../../components/InputField";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import Repository from "../../data/repository";
import { useRoute } from "@react-navigation/native";
import * as Contacts from "expo-contacts";

const AddExpensesDetails = () => {
  const repository = new Repository();
  const route = useRoute();
  const { contacts } = route.params || {};
  const selectedContactIds = contacts
    ? JSON.parse(decodeURIComponent(contacts))
    : [];

  const [contactDetails, setContactDetails] = useState([]);
  const [percentages, setPercentages] = useState({});

  // Permission to get access to contacts
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });

          if (data.length > 0) {
            const filteredContacts = data.filter((contact) =>
              selectedContactIds.includes(contact.id)
            );
            setContactDetails(filteredContacts);

            const initialPercentages = {};
            filteredContacts.forEach((contact) => {
              initialPercentages[contact.id] = "";
            });
            setPercentages(initialPercentages);
          }
        } else {
          console.log("Contacts permission denied");
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    })();
  }, [selectedContactIds]);

  // useState for amount and setDetails
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");

  async function addExpenses() {
    const totalPercentage = Object.values(percentages).reduce(
      (acc, percent) => acc + parseFloat(percent || 0),
      0
    );
    if (totalPercentage === 100) {
      await repository.addExpenses(amount, details, (success) => {
        if (success) {
          router.push("(tabs)");
        }
      });
    } else {
      Alert.alert("Error", "The total percentage must be exactly 100.");
    }
  }

  // adding add button in the navigation
  const nav = useNavigation();
  nav.setOptions({
    headerShown: true,
    title: "Add Expenses",
    headerRight: () => <Button onPress={addExpenses} title="Add" />,
  });

  const renderContact = ({ item }) => (
    <View style={styles.contactContainer}>
      <Text style={styles.contactName}>{item.name}</Text>
      {item.phoneNumbers &&
        item.phoneNumbers.map((phone, idx) => (
          <Text key={idx} style={styles.phoneNumber}>
            {phone.number}
          </Text>
        ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.scrollView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <InputField enteredText={amount} onChangeText={(text) => setAmount(text)}>
        Add Amount
      </InputField>
      <InputField
        enteredText={details}
        onChangeText={(text) => setDetails(text)}
      >
        Details
      </InputField>
      <Text style={styles.header}>Selected People</Text>
      <FlatList
        data={contactDetails}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  contactContainer: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phoneNumber: {
    fontSize: 16,
    color: "#555",
  },
  percentageInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
});

export default AddExpensesDetails;
