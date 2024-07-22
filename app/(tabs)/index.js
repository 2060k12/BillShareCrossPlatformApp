import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import Repository from "../../data/repository";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

const HomePage = () => {
  const db = useContext(FirestoreContext);
  const repository = new Repository();
  const [receivingTransactions, setReceivingTransactions] = useState([]);
  const [payingTransactions, setPayingTransactions] = useState([]);

  async function fetchTransactions() {
    await repository.seeAllPayingTransaction();
    await repository.seeAllReceivingTransaction();
    setReceivingTransactions(repository.arrayOfReceivingTransactions);
    setPayingTransactions(repository.arrayOfPayingTransactions);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View>
      <View style={styles.transactionsContainer}>
        <Text>What you'll receive</Text>
        <FlatList
          keyExtractor={(item) => item.id}
          data={receivingTransactions}
          renderItem={({ item }) => (
            <View style={styles.receivingTransactions}>
              <Text>{item.otherUsers}</Text>
              <Text>{item.amount}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.transactionsContainer}>
        <Text>What you'll Pay</Text>
        <FlatList
          keyExtractor={(item) => item.id}
          data={payingTransactions}
          renderItem={({ item }) => (
            <View style={styles.payingTransactions}>
              <Text>{item.otherUsers}</Text>
              <Text>{item.amount}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  transactionsContainer: {
    marginHorizontal: 8,
  },
  receivingTransactions: {
    padding: 16,
    borderRadius: 10,
    paddingVertical: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "green",
  },
  payingTransactions: {
    padding: 16,

    borderRadius: 10,
    paddingVertical: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "red",
  },
});
