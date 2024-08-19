import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import Repository from "../data/repository";
import firebase from "firebase/app"; // Import firebase
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, router } from "expo-router";

const History = () => {
  const navigation = useNavigation();
  const repository = new Repository();
  const [listOfTransactions, setListOfTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null); // State to manage expanded card

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Transaction History",
      headerBackTitle: "Back", // Sets the back button label
    });
  }, [navigation]);
  async function fetchTransactions() {
    try {
      setLoading(true);
      await repository.getSettledTransactions();
      setListOfTransactions(repository.listOfSettledTransactions);
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

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const renderItem = ({ item }) => {
    const date = item.timeStamp.toDate(); // Convert Firebase timestamp to Date
    const formattedDate = date.toLocaleString(); // Format the date
    const isExpanded = expandedCard === item.id;
    const borderColor = item.status === "settled" ? "green" : "red";

    return (
      <Pressable onPress={() => toggleExpand(item.id)}>
        <View style={[styles.card, { borderRightColor: borderColor }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{item.addedBy}</Text>
            <Text style={styles.cardAmount}>AU$ {item.amount}</Text>
          </View>
          <Text style={styles.cardDate}>{formattedDate}</Text>
          {isExpanded && (
            <View style={styles.cardDetailsContainer}>
              <Text style={styles.cardDetails}>{item.details}</Text>
              <Text style={styles.cardTotalAmount}>
                Total: AU$ {item.totalAmount}
              </Text>
            </View>
          )}
          <FontAwesome
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#888"
          />
        </View>
      </Pressable>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listOfTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRightWidth: 5, // Border width for status indicator
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDate: {
    fontSize: 14,
    color: "#888",
    textAlign: "right",
  },
  cardDetailsContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  cardDetails: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  cardTotalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default History;
