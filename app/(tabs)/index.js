import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import Repository from "../../data/repository";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const HomePage = () => {
  const router = useRouter();
  const db = useContext(FirestoreContext);
  const repository = new Repository();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchTransactions() {
    try {
      setLoading(true);
      await repository.getAllTransactions();
      setTransactions(repository.listOfTransactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleNavigate = (transaction) => {
    router.push({
      pathname: `/expensesDetails/${transaction.id}`,
      params: {
        transaction: JSON.stringify(transaction),
      },
    });
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={[
        styles.transactionCard,
        item.status === "receive" ? styles.receiveCard : styles.payCard,
      ]}
      onPress={() => handleNavigate(item)}
    >
      <View style={styles.pressableContent}>
        {item.status === "receive" ? (
          <MaterialIcons
            name="attach-money"
            size={40}
            color="green"
            style={styles.icon}
          />
        ) : (
          <MaterialIcons
            name="money-off"
            size={40}
            color="red"
            style={styles.icon}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.transactionText}>{item.title}</Text>
          <Text style={styles.transactionAmount}>${item.amount}</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={renderFooter}
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
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  receiveCard: {
    backgroundColor: "#E8F5E9",
  },
  payCard: {
    backgroundColor: "#FFEBEE",
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
