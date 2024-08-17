import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import Repository from "../../data/repository";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const HomePage = () => {
  const router = useRouter();
  const db = useContext(FirestoreContext);
  const repository = new Repository();
  const [transactions, setTransactions] = useState([]);

  async function fetchTransactions() {
    try {
      await repository.getAllTransactions();
      setTransactions(repository.listOfTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleNavigate = (transaction) => {
    router.push({
      pathname: `/expensesDetails/${transaction.id}`,
      params: {
        transaction: JSON.stringify(transaction), // Pass as JSON string
      },
    });
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.transactionCard}
      onPress={() => handleNavigate(item)} // Use handleNavigate
    >
      <View style={styles.pressableContent}>
        {item.status === "receive" ? (
          <FontAwesome
            name="money"
            size={40}
            color="green"
            style={styles.icon}
          />
        ) : (
          <FontAwesome name="money" size={40} color="red" style={styles.icon} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.transactionText}>{item.title}</Text>
          <Text style={styles.transactionAmount}>${item.amount}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#F4F4F4",
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 16,
    color: "#333",
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pressableContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  transactionText: {
    fontSize: 18,
    color: "#333",
  },
  transactionAmount: {
    fontSize: 16,
    marginTop: 4,
    color: "#555",
  },
  icon: {
    marginRight: 12,
  },
});
