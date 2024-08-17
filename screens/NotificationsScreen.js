import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Repository from "../data/repository";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const NotificationsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const repository = new Repository();
  const router = useRouter();

  const fetchTransactions = async () => {
    try {
      await repository.getAllTransactions();
      setTransactions(repository.listOfTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const handleNotificationPress = (transaction) => {
    router.push({
      pathname: `/expensesDetails/${transaction.id}`,
      params: {
        transaction: JSON.stringify(transaction), // Pass as JSON string
      },
    });
  };

  const renderNotification = ({ item }) => (
    <Pressable
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
    >
      <MaterialIcons name="notifications" size={24} color="black" />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>
          {item.status === "receive" ? "You will receive" : "You need to pay"}:{" "}
          {item.title}
        </Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
        <Text style={styles.notificationAmount}>
          Amount: ${item.amount.toFixed(2)}
        </Text>
        <Text style={styles.notificationTimestamp}>
          {new Date(item.timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16, // Increased vertical spacing
  },
  notificationContent: {
    marginLeft: 16,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4, // Added vertical spacing
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4, // Added vertical spacing
  },
  notificationAmount: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4, // Added vertical spacing
  },
  notificationTimestamp: {
    fontSize: 12,
    color: "#999",
  },
});

export default NotificationsScreen;
