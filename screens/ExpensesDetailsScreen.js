import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Modal,
} from "react-native";
import { FilledButton, OutlinedButton } from "../components/Button";
import Repository from "../data/repository";

const ExpensesDetailScreen = () => {
  // state for model view
  const [editMode, setEditMode] = useState(false);

  const nav = useNavigation();
  nav.setOptions({
    headerShown: true,
    title: "Transactions Details",
    headerBackTitle: "back",
    headerRight: () => (
      <Button title="Edit" onPress={() => setEditMode(true)} />
    ),
  });
  const { id, ...transaction } = useLocalSearchParams();
  // repository use firebase functions
  const repository = new Repository();

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topContainer}>
        <View style={styles.headerContainer}>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>
            {transaction.otherUsers}
          </Text>
          <View style={styles.amountContainer}>
            <Text style={{ fontSize: 26, color: "red" }}>
              $ {transaction.amount}
            </Text>
            <Text style={{ fontSize: 12, textAlign: "right" }}>5hrs ago</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={{ fontSize: 20 }}>{transaction.details}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <FilledButton>Settle Up</FilledButton>
        <OutlinedButton
          onPress={() => {
            repository.removeTransaction("receive", id, (success) => {
              if (success) {
                router.push("/(tabs)");
              }
            });
          }}
        >
          Remove
        </OutlinedButton>
      </View>

      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setEditMode(false)}
        visible={editMode}
      ></Modal>
    </SafeAreaView>
  );
};

export default ExpensesDetailScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountContainer: {},
  bodyContainer: {
    marginVertical: 50,
  },
  screenContainer: {
    justifyContent: "space-between",
    flex: 1,
    margin: 16,
  },
  buttonContainer: {},
  topContainer: { paddingVertical: 16 },
});
