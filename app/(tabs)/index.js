import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import Repository from "../../data/repository";

const HomePage = () => {
  const db = useContext(FirestoreContext);
  const repository = new Repository();
  const [listOfTransactions, setListOfTransactions] = useState([]);

  async function fetchTransactions() {
    await repository.seeAllTransaction();
    setListOfTransactions(repository.arrayOfTransactions);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View>
      <FlatList
        keyExtractor={(item) => item.id}
        data={listOfTransactions}
        renderItem={({ item }) => (
          <View style={styles.transactionList}>
            <Text>{item.amount}</Text>
            <Text>{item.otherUsers}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  transactionList: {
    paddingVertical: 16,
    backgroundColor: "#bbbbbb",
    marginVertical: 4,
  },
});
