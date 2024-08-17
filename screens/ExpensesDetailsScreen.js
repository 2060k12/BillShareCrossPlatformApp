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
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import Repository from "../data/repository";
import * as InputField from "../components/InputField";
import { FilledButton, OutlinedButton } from "../components/Button";
import { format } from "date-fns";

const ExpensesDetailScreen = () => {
  const router = useRouter();
  const nav = useNavigation();
  const { id, transaction } = useLocalSearchParams();
  const parsedTransaction = JSON.parse(transaction);

  const [editMode, setEditMode] = useState(false);
  const [amount, setAmount] = useState(parsedTransaction.amount);
  const [transactionsFullInfo, setTransactionsFullInfo] = useState(null);
  const [editPerson, setEditPerson] = useState(null);
  const [newPercentage, setNewPercentage] = useState("");
  const repository = new Repository();

  const handleRemovePerson = (phoneNumber) => {
    const updatedInvolvedPeople = transactionsFullInfo.involvedPeople.filter(
      (person) => person.phoneNumber !== phoneNumber
    );
    setTransactionsFullInfo((prev) => ({
      ...prev,
      involvedPeople: updatedInvolvedPeople,
    }));
  };

  useEffect(() => {
    repository.getTransactionDetails(id, (transaction) => {
      if (transaction) {
        setTransactionsFullInfo(transaction);
      } else {
        Alert.alert("Error", "Transaction details could not be fetched.");
      }
    });
  }, [id]);

  nav.setOptions({
    headerShown: true,
    title: "Transaction Details",
    headerBackTitle: "Back",
    headerRight: () => (
      <Button title="Edit" onPress={() => setEditMode(true)} />
    ),
  });

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

  const formattedTimestamp = parsedTransaction.timeStamp
    ? format(new Date(parsedTransaction.timeStamp.seconds * 1000), "PPpp")
    : "Unknown";

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.card}>
        <View style={styles.topContainer}>
          <Text style={styles.titleText}>{parsedTransaction.otherUsers}</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>
              AU${parseFloat(parsedTransaction.amount).toFixed(2)}
            </Text>
            <Text style={styles.timestampText}>{formattedTimestamp}</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.detailsText}>{parsedTransaction.details}</Text>
        </View>
      </View>

      <View style={styles.involvedPeopleContainer}>
        <Text style={styles.titleText}>Involved People</Text>
        <FlatList
          data={transactionsFullInfo?.involvedPeople || []}
          renderItem={({ item }) => (
            <View style={styles.personContainer}>
              <Text style={styles.personName}>{item.name}</Text>
              <Text style={styles.personPhone}>{item.phoneNumber}</Text>
              <Text style={styles.personPercentage}>{item.percentage}%</Text>
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
          keyExtractor={(item) => item.phoneNumber}
        />
      </View>

      <View style={styles.buttonContainer}>
        <FilledButton
          onPress={() => {
            Alert.alert("Settle Up functionality is not implemented.");
          }}
          style={styles.settleButton}
        >
          Settle Up
        </FilledButton>
        <OutlinedButton
          onPress={() => {
            repository.removeTransaction(
              parsedTransaction.status,
              parsedTransaction.id,
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

            <FlatList
              data={transactionsFullInfo?.involvedPeople || []}
              renderItem={({ item }) => (
                <View style={styles.personContainer}>
                  <Text style={styles.personName}>{item.name}</Text>
                  <Text style={styles.personPhone}>{item.phoneNumber}</Text>
                  <TextInput
                    style={styles.input}
                    value={
                      editPerson && editPerson.phoneNumber === item.phoneNumber
                        ? newPercentage
                        : item.percentage.toString()
                    }
                    onChangeText={(text) => {
                      if (
                        editPerson &&
                        editPerson.phoneNumber === item.phoneNumber
                      ) {
                        setNewPercentage(text);
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="New Percentage"
                  />
                  <View style={styles.personActions}>
                    <Button
                      title="Remove"
                      onPress={() => handleRemovePerson(item.phoneNumber)}
                    />
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.phoneNumber}
            />

            <View style={styles.modalButtons}>
              <FilledButton
                onPress={() => handleSavePersonChanges()}
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
    flexDirection: "row",
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
});
