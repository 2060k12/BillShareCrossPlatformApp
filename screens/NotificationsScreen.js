import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Repository from "../data/repository";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Notifications } from "../data/Notifications";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const repository = new Repository();
  const router = useRouter();

  // Fetch notifications using the provided getNotifications method
  const fetchNotifications = async () => {
    try {
      repository.getNotifications((fetchedNotifications) => {
        const formattedNotifications = fetchedNotifications.map(
          (notification) =>
            new Notifications(
              notification.amount,
              notification.body,
              notification.docId,
              notification.timestamp.toDate(), // Convert Firestore timestamp to Date object
              notification.title
            )
        );

        // Sort notifications by timestamp in descending order
        const sortedNotifications = formattedNotifications.sort(
          (a, b) => b.timestamp - a.timestamp
        );

        setNotifications(sortedNotifications);
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const handleNotificationPress = (notification) => {
    // router.push({
    //   pathname: `/expensesDetails/${notification.docId}`,
    //   params: {
    //     notification: JSON.stringify(notification), // Pass as JSON string
    //   },
    // });
  };

  const renderNotification = ({ item }) => (
    <Pressable
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
    >
      <MaterialIcons name="notifications" size={24} color="black" />
      <View style={styles.notificationContent}>
        <View style={styles.notificationText}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationDescription}>{item.body}</Text>
        </View>
        <View style={styles.notificationText}>
          <Text style={styles.notificationAmount}>
            ${item.amount.toFixed(2)}
          </Text>
          <Text style={styles.notificationTimestamp}>
            {item.timestamp.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.docId}
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
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  notificationContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
    flex: 1,
  },
  notificationText: {
    flexDirection: "column",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  notificationAmount: {
    fontSize: 20,
    color: "#333",
    marginBottom: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: "#999",
  },
});

export default NotificationsScreen;
