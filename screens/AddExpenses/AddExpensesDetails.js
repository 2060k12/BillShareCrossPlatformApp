import { router, useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { firebaseConfig } from "../../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  Button,
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import InputField from "../../components/InputField";
import Repository from "../../data/repository";
import { useRoute } from "@react-navigation/native";
import * as Contacts from "expo-contacts";
import { TextInput } from "react-native-gesture-handler";

const AddExpensesDetails = () => {
  // Initialize Firebase app and auth
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Initialize repository
  const repository = new Repository(auth);
  // Initialize router
  const route = useRoute();
  // Get selected contacts from route params
  const { contacts } = route.params || {};
  // Parse selected contacts
  const selectedContactIds = contacts
    ? JSON.parse(decodeURIComponent(contacts))
    : [];

  // Initialize state variables
  const [contactDetails, setContactDetails] = useState([]);
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [involvedPeople, setInvolvedPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState(0.0);

  // Fetch contacts with permission
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(false);
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
            }));
            setInvolvedPeople(initialPeople);

            async function fetchUserData() {
              try {
                const userData = await repository.getCurrentUser();
                if (userData) {
                  setInvolvedPeople((prevPeople) => [
                    ...prevPeople,
                    {
                      name: userData.name,
                      phoneNumber: userData.phoneNumber,
                    },
                  ]);
                }
              } catch (error) {
                console.error("Error fetching user data:", error);
              }
            }

            fetchUserData();
          }
        } else {
          Alert.alert("Permission Denied", "Cannot access contacts.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const navigation = useNavigation();
  // Set navigation options
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Add Expenses",
    });
  }, []);

  return (
    // Add KeyboardAvoidingView to handle keyboard
    <KeyboardAvoidingView>
      <GestureHandlerRootView
        style={styles.scrollView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View>
            <TextInput
              style={styles.percentageInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="Total Amount"
            />
          </View>

          <View>
            <TextInput
              style={styles.multiline}
              value={details}
              onChangeText={setDetails}
              multiline={true}
              placeholder="Expenses Details"
            />
          </View>

          <View>
            <Text style={{ fontSize: 24, fontWeight: "bold", paddingLeft: 10 }}>
              Involved People
            </Text>
            {involvedPeople.map((person, index) => (
              <View key={index} style={styles.contactContainer}>
                <Text style={styles.contactName}>{person.name}</Text>
                <Text style={styles.phoneNumber}>{person.phoneNumber}</Text>
                <InputField
                  placeholder={"Percentage"}
                  keyboardType="numeric" // Ensure numeric input
                  onChangeText={(text) => {
                    const percentage = parseFloat(text) || 0; // Convert to number or default to 0 if NaN
                    const updatedPeople = [...involvedPeople];

                    // Subtract old percentage and add the new one
                    const oldPercentage = updatedPeople[index].percentage || 0;
                    updatedPeople[index].percentage = percentage;
                    setInvolvedPeople(updatedPeople);
                    setTotalPercentage(
                      totalPercentage - oldPercentage + percentage
                    );
                  }}
                >
                  Enter Percentage Share
                </InputField>
              </View>
            ))}
          </View>
          <Button
            title="Add Expenses"
            onPress={() => {
              if (!amount || !details) {
                Alert.alert("Error", "Please enter amount and details");
                return;
              }

              if (totalPercentage !== 100) {
                Alert.alert("Error", "Total percentage should be 100");
                return;
              }

              const expenseData = {
                amount: parseFloat(amount),
                details,
                involvedPeople,
              };

              repository.addExpense(expenseData, (success) => {
                if (success) {
                  Alert.alert("Success", "Expense added successfully", [
                    {
                      text: "OK",
                      onPress: () => router.replace("/(tabs)"),
                    },
                  ]);
                } else {
                  Alert.alert("Error", "Failed to add expense");
                }
              });
            }}
          />
        </ScrollView>
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {},

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

    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 16,
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  multiline: {
    marginTop: 10,
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    margin: 10,
    fontSize: 20,
  },
});

export default AddExpensesDetails;
