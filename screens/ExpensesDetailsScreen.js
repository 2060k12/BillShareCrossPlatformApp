import { useState, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import Repository from "../data/repository";
import * as InputField from "../components/InputField";
import { FilledButton, OutlinedButton } from "../components/Button";
import { format, set } from "date-fns";
import { firebaseConfig } from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const ExpensesDetailScreen = () => {
  // Initialize Firebase app and auth
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  //  Initialize router and local search params
  const router = useRouter();
  const nav = useNavigation();
  const { id, transaction } = useLocalSearchParams();
  const parsedTransaction = JSON.parse(transaction);

  // Function to calculate total percentage
  const calculateTotalPercentage = (people) => {
    return people.reduce(
      (total, person) => total + (parseFloat(person.percentage) || 0),
      0
    );
  };

  // Initialize state variables
  const [editMode, setEditMode] = useState(false);
  const [amount, setAmount] = useState(parsedTransaction.totalAmount);
  const [transactionsFullInfo, setTransactionsFullInfo] = useState(null);
  const [initiallyInvolvedPeople, setInitiallyInvolvedPeople] = useState([]);
  const [editPerson, setEditPerson] = useState(null);
  const [newPercentage, setNewPercentage] = useState("");
  const repository = new Repository(auth);

  //  Function to remove a person from the transaction
  const handleRemovePerson = (phoneNumber) => {
    const updatedInvolvedPeople = transactionsFullInfo.involvedPeople.filter(
      (person) => person.phoneNumber !== phoneNumber
    );
    setTransactionsFullInfo((prev) => ({
      ...prev,
      involvedPeople: updatedInvolvedPeople,
    }));
  };

  // Fetch transaction details
  useEffect(() => {
    repository.getTransactionDetails(id, (transaction) => {
      if (transaction) {
        setTransactionsFullInfo(transaction);
        setInitiallyInvolvedPeople(transaction.involvedPeople);
      } else {
        Alert.alert("Error", "Transaction details could not be fetched.");
      }
    });
  }, [id]);

  const [myAmount, setMyAmount] = useState(0);

  // Calculate the amount that the current user owes
  useEffect(() => {
    if (
      transactionsFullInfo?.involvedPeople &&
      auth?.currentUser?.displayName
    ) {
      setAmount(transactionsFullInfo.amount);
      const currentUser = transactionsFullInfo.involvedPeople.find(
        (person) => person.phoneNumber === auth.currentUser.displayName
      );

      console.log("currentUser", currentUser);
      console.log("transactionsFullInfo", transactionsFullInfo);
      if (currentUser) {
        setMyAmount(
          (currentUser.percentage * transactionsFullInfo.amount) / 100
        );
      }
    }
  }, [transactionsFullInfo, auth?.currentUser?.userName]);

  // Set navigation options
  nav.setOptions({
    headerShown: true,
    title: "Transaction Details",
    headerBackTitle: "Back",
    headerRight: () => (
      <Button title="Edit" onPress={() => setEditMode(true)} />
    ),
  });

  // Function to save changes to a person's percentage
  const handleSavePersonChanges = () => {
    if (editPerson && newPercentage) {
      const updatedInvolvedPeople = transactionsFullInfo.involvedPeople.map(
        (person) => {
          if (person.phoneNumber === editPerson.phoneNumber) {
            return { ...person, percentage: newPercentage };
          }
          return person;
        }
      );
      setTransactionsFullInfo({
        ...transactionsFullInfo,
        involvedPeople: updatedInvolvedPeople,
      });
      setEditPerson(null);
      setNewPercentage("");
    } else {
      Alert.alert(
        "Error",
        "Please select a person and enter a new percentage."
      );
    }
  };

  const totalPercentage = transactionsFullInfo?.involvedPeople
    ? calculateTotalPercentage(transactionsFullInfo.involvedPeople)
    : 0;

  const formattedTimestamp = parsedTransaction.timeStamp
    ? format(new Date(parsedTransaction.timeStamp.seconds * 1000), "PPpp")
    : "Unknown";

  const isPayedBy = (phoneNumber) => {
    return transactionsFullInfo?.payedBy.includes(phoneNumber);
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.card}>
        <View style={styles.topContainer}>
          <Text style={styles.titleText}>{parsedTransaction.otherUsers}</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>
              AU${parseFloat(parsedTransaction.totalAmount).toFixed(2)}
            </Text>
            <Text style={styles.timestampText}>{formattedTimestamp}</Text>
          </View>
          {totalPercentage !== 100 && (
            <Text style={styles.errorText}>
              Total percentage is not 100%. Please adjust.
            </Text>
          )}
          <Text style={styles.iOweText}>
            {totalPercentage === 100
              ? `What I Owe: AU$${parseFloat(myAmount).toFixed(2)}`
              : "Please correct the percentages"}
          </Text>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.detailsText}>{parsedTransaction.details}</Text>
        </View>
      </View>

      <View>
        <Text>Payed By</Text>
        <Text style={styles.personName}>{transactionsFullInfo?.payedBy}</Text>
      </View>

      <View style={styles.involvedPeopleContainer}>
        <Text style={styles.titleText}>Involved People</Text>
        <FlatList
          data={transactionsFullInfo?.involvedPeople || []}
          renderItem={({ item }) => (
            <View
              style={[
                styles.personContainer,
                isPayedBy(item.phoneNumber)
                  ? styles.greenLight
                  : styles.redLight,
              ]}
            >
              <View style={styles.personContainer}>
                <Text style={styles.personName}>{item.name}</Text>
                <Text style={styles.personPhone}>{item.phoneNumber}</Text>
              </View>
              <View style={styles.personContainer}>
                <Text style={styles.personPercentage}>{item.percentage}%</Text>
                <Text style={styles.personPercentage}>
                  {(item.percentage * transactionsFullInfo.amount) / 100}
                </Text>
              </View>
              {editMode && (
                <View style={styles.personActions}>
                  <Button
                    title="Edit"
                    onPress={() => {
                      setEditPerson(item);
                      setNewPercentage(item.percentage.toString());
                    }}
                  />
                  <Button
                    title="Remove"
                    onPress={() => handleRemovePerson(item.phoneNumber)}
                  />
                </View>
              )}
            </View>
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <FilledButton
          style={styles.settleButton}
          onPress={() => {
            repository.settleTransaction(
              parsedTransaction.id,
              transactionsFullInfo.involvedPeople,
              (success) => {
                if (success) {
                  Alert.alert("Successfully Settled.");
                  router.push("/(tabs)");
                }
              }
            );
          }}
        >
          Settle Up
        </FilledButton>
        <OutlinedButton
          onPress={() => {
            repository.removeTransaction(
              amount,
              parsedTransaction.status,
              parsedTransaction.id,
              transactionsFullInfo.involvedPeople,
              (success) => {
                if (success) {
                  router.push("/(tabs)");
                }
              }
            );
          }}
          style={styles.removeButton}
        >
          Remove
        </OutlinedButton>
      </View>

      {/* Modal fo when edit option is clicked */}
      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setEditMode(false)}
        visible={editMode}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Button title="Back" onPress={() => setEditMode(false)} />
            <Text style={styles.modalTitle}>Edit Transaction</Text>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Amount</Text>
            <InputField.default
              enteredText={amount}
              onChangeText={(text) => setAmount(text)}
            >
              Enter New Amount
            </InputField.default>

            {transactionsFullInfo?.involvedPeople.map((item) => (
              <View key={item.phoneNumber} style={styles.personCard}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{item.name}</Text>
                  <Text style={styles.personPhone}>{item.phoneNumber}</Text>
                </View>

                <Text style={styles.personPercentage}>{item.percentage}%</Text>
                <Text style={styles.personPercentage}>
                  {(item.percentage * transactionsFullInfo.amount) / 100}
                </Text>
                {editMode && (
                  <View style={styles.personActions}>
                    <Button
                      title="Edit"
                      onPress={() =>
                        Alert.prompt(
                          "Edit Percentage",
                          `Enter new percentage for ${item.name}`,
                          (text) => {
                            if (text) {
                              const updatedInvolvedPeople =
                                transactionsFullInfo.involvedPeople.map(
                                  (person) => {
                                    if (
                                      person.phoneNumber === item.phoneNumber
                                    ) {
                                      return {
                                        ...person,
                                        percentage: parseInt(text, 10),
                                      };
                                    }
                                    return person;
                                  }
                                );
                              setTransactionsFullInfo({
                                ...transactionsFullInfo,
                                involvedPeople: updatedInvolvedPeople,
                              });
                            }
                          },
                          "plain-text",
                          item.percentage.toString()
                        )
                      }
                    />
                    <Button
                      title="Remove"
                      onPress={() => handleRemovePerson(item.phoneNumber)}
                    />
                  </View>
                )}
              </View>
            ))}

            <View style={styles.modalButtons}>
              <FilledButton
                onPress={() => {
                  if (totalPercentage !== 100) {
                    return Alert.alert(
                      "Error",
                      "Total percentage should be 100"
                    );
                  }

                  repository.updateTransactions(
                    id,
                    amount,
                    (details = "New Details"),
                    transactionsFullInfo.involvedPeople,
                    initiallyInvolvedPeople,
                    (success) => {
                      if (success) {
                        setEditMode(false);
                      } else {
                        Alert.alert(
                          "Error",
                          "Transaction could not be updated."
                        );
                      }
                    }
                  );
                }}
                style={styles.saveButton}
              >
                Save
              </FilledButton>

              <OutlinedButton
                onPress={() => setEditMode(false)}
                style={styles.cancelButton}
              >
                Cancel
              </OutlinedButton>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ExpensesDetailScreen;

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    margin: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 16,
  },
  topContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    paddingBottom: 8,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 26,
    color: "red",
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
  },
  bodyContainer: {
    marginTop: 16,
  },
  detailsText: {
    fontSize: 20,
    color: "#333",
  },
  involvedPeopleContainer: {
    marginTop: 16,
  },
  personContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  personName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  personPhone: {
    fontSize: 16,
    color: "#555",
  },
  personPercentage: {
    fontSize: 16,
    color: "#888",
    alignSelf: "flex-end",
  },
  personActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    flex: 1,
    marginRight: 8,
    padding: 4,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  settleButton: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    flex: 1,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },

  personCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 16,
  },

  personInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  personName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  personPhone: {
    fontSize: 16,
    color: "#555",
  },

  personPercentage: {
    fontSize: 16,
    color: "#888",
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    flex: 1,
    marginRight: 8,
    padding: 4,
  },
  greenLight: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    backgroundColor: "rgba(0, 255, 0, 0.1)", // Green with 10% opacity
  },

  percentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  redLight: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    backgroundColor: "rgba(255, 0, 0, 0.1)", // Red with 10% opacity
  },
  personActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
