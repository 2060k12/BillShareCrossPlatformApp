import { router, useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import InputField from "../../components/InputField";
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
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [involvedPeople, setInvolvedPeople] = useState([]);

  // Fetch contacts with permission
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

            // Initialize involvedPeople with filtered contacts
            const initialPeople = filteredContacts.map((contact) => ({
              name: contact.name,
              phoneNumber: contact.phoneNumbers[0]?.number || "",
              percentage: "",
            }));
            setInvolvedPeople(initialPeople);
          }
        } else {
          console.log("Contacts permission denied");
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    })();
  }, [selectedContactIds]);

  // Add expenses function
  async function addExpenses() {
    const totalPercentage = involvedPeople.reduce(
      (acc, person) => acc + parseFloat(person.percentage || 0),
      0
    );

    try {
      await repository.addExpenses(
        amount,
        details,
        involvedPeople,
        (success) => {
          try {
            if (success) {
              router.push("(tabs)");
            } else {
              Alert.alert("Error", "Failed to add expenses");
            }
          } catch (callbackError) {
            console.error("Error in callback:", callbackError);
            Alert.alert("Error", "An unexpected error occurred");
          }
        }
      );
    } catch (error) {
      console.error("Error adding expenses:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while adding expenses"
      );
    }
  }

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Add Expenses",
      headerRight: () => <Button onPress={addExpenses} title="Add" />,
    });
  }, [navigation, amount, details, involvedPeople]);

  const handlePercentageChange = (phoneNumber, text) => {
    const updatedPeople = involvedPeople.map((person) =>
      person.phoneNumber === phoneNumber
        ? { ...person, percentage: text }
        : person
    );
    setInvolvedPeople(updatedPeople);
  };

  const renderContact = ({ item }) => (
    <View style={styles.contactContainer}>
      <Text style={styles.contactName}>{item.name}</Text>
      {item.phoneNumbers &&
        item.phoneNumbers.map((phone, idx) => (
          <View key={idx}>
            <Text style={styles.phoneNumber}>{phone.number}</Text>
            <InputField
              placeholder="Enter percentage"
              keyboardType="numeric"
              onChangeText={(text) =>
                handlePercentageChange(phone.number, text)
              }
            />
          </View>
        ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.scrollView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <InputField enteredText={amount} onChangeText={setAmount}>
        Add Amount
      </InputField>
      <InputField enteredText={details} onChangeText={setDetails}>
        Details
      </InputField>
      <Text style={styles.header}>Selected People</Text>
      <FlatList
        data={contactDetails}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
      />
      <Button title="Add Expenses" onPress={addExpenses} />
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
