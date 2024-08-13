import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Example notification data
const notifications = [
  {
    id: "1",
    title: "Pranish",
    description: "New Bill Added ",
  },
  {
    id: "2",
    title: "Abinash",
    description: "Abinash, Setteled the bill",
  },
  {
    id: "3",
    title: "Sudhir",
    description: "New Bill Added",
  },
];

const NotificationsScreen = () => {
  const handleNotificationPress = (notification) => {
    Alert.alert(notification.title, notification.description);
  };

  const renderNotification = ({ item }) => (
    <Pressable
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
    >
      <MaterialIcons name="notifications" size={24} color="black" />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
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
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  notificationContent: {
    marginLeft: 12,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#555",
  },
});

export default NotificationsScreen;
