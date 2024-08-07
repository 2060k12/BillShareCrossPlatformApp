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
      await repository.seeAllPayingTransaction();
      await repository.seeAllReceivingTransaction();

      const combinedTransactions = [
        ...repository.arrayOfReceivingTransactions.map((item) => ({
          ...item,
          type: "receiving",
        })),
        ...repository.arrayOfPayingTransactions.map((item) => ({
          ...item,
          type: "paying",
        })),
      ];

      setTransactions(combinedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderItem = ({ item }) => {
    const isReceiving = item.type === "receiving";
    return (
      <View
        style={[
          styles.transactionCard,
          { borderColor: isReceiving ? "#007BFF" : "#FF6F61" }, // Blue for receiving, Coral for paying
        ]}
      >
        <Pressable
          onPress={() => {
            if (isReceiving) {
              router.push({
                pathname: `/expensesDetails/${item.id}`,
                params: item,
              });
            }
          }}
          style={styles.pressableContent}
          android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
        >
          <View style={styles.transactionContent}>
            <FontAwesome
              name={isReceiving ? "arrow-down" : "arrow-up"}
              size={24}
              color={isReceiving ? "#007BFF" : "#FF6F61"}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.transactionText}>{item.otherUsers}</Text>
              <Text style={styles.transactionAmount}>$ {item.amount}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>Transactions</Text>
      <FlatList
        keyExtractor={(item) => item.id}
        data={transactions}
        renderItem={renderItem}
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
    backgroundColor: "#F4F4F4", // Light gray background for a clean look
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 16,
    color: "#333", // Darker text for contrast
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#FFFFFF", // White background for cards
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pressableContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  transactionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  transactionText: {
    fontSize: 18,
    color: "#333", // Darker text for readability
  },
  transactionAmount: {
    fontSize: 16,
    marginTop: 4,
    color: "#555", // Slightly lighter color for amount
  },
  icon: {
    marginRight: 12,
  },
});
