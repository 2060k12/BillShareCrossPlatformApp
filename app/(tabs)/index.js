import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import Repository from "../../data/repository";

import { useRouter } from "expo-router";

const HomePage = () => {
  const router = useRouter();

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
        <Text style={styles.titleStyle}>What you'll receive</Text>
        <FlatList
          keyExtractor={(item) => item.id}
          data={receivingTransactions}
          renderItem={({ item }) => (
            <View style={styles.receivingTransactions}>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: `/expensesDetails/${item.id}`,
                    params: item,
                  });
                }}
                style={{ padding: 16 }}
                android_ripple={{ color: "black" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={styles.transactionsFontStyle}>
                      {item.otherUsers}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.transactionsFontStyle}>
                      $ {item.amount}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        />
      </View>
      <View style={styles.transactionsContainer}>
        <Text style={styles.titleStyle}>What you'll Pay</Text>
        <FlatList
          keyExtractor={(item) => item.id}
          data={payingTransactions}
          renderItem={({ item }) => (
            <View style={styles.payingTransactions}>
              <Pressable
                style={{ padding: 16 }}
                android_ripple={{ color: "black" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={styles.transactionsFontStyle}>
                      {item.otherUsers}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.transactionsFontStyle}>
                      $ {item.amount}
                    </Text>
                  </View>
                </View>
              </Pressable>
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
    marginHorizontal: 16,
  },
  receivingTransactions: {
    flex: 1,
    justifyContent: "center",
    height: 100,
    borderRadius: 10,
    marginVertical: 4,
    backgroundColor: "green",
    overflow: "hidden",
  },
  payingTransactions: {
    borderRadius: 10,
    justifyContent: "center",
    height: 100,
    marginVertical: 4,
    backgroundColor: "red",
    overflow: "hidden",
  },

  transactionsFontStyle: {
    color: "white",
    fontSize: 20,
  },

  titleStyle: {
    marginTop: 16,
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 26,
  },
});
