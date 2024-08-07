import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import InputField from "../../components/InputField";
import { useNavigation } from "@react-navigation/native";
import * as Contacts from "expo-contacts";

const AddExpenses = () => {
  const [search, setSearch] = useState("");
  const [contactsList, setContactsList] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const navigation = useNavigation();

  // Function called when the Add button is pressed
  const addButtonListener = () => {
    console.log(selectedContacts);
    navigation.navigate("addExpensesDetails", {
      contacts: JSON.stringify(Array.from(selectedContacts)),
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Add" onPress={addButtonListener} />,
    });
  }, [navigation, selectedContacts]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === "granted") {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });

          if (data.length > 0) {
            const contacts = data.map((contact) => ({
              id: contact.id,
              name: contact.name,
              phoneNumbers: contact.phoneNumbers,
            }));
            setContactsList(contacts);
          }
        } else {
          console.log("Contacts permission denied");
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    })();
  }, []);

  const handleSelectContact = (contact) => {
    setSelectedContacts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(contact.id)) {
        newSelected.delete(contact.id);
      } else {
        newSelected.add(contact.id);
      }
      return newSelected;
    });
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.contactContainer,
        selectedContacts.has(item.id) && styles.selectedContact,
      ]}
      onPress={() => handleSelectContact(item)}
    >
      <Text style={styles.contactName}>{item.name}</Text>
      {item.phoneNumbers &&
        item.phoneNumbers.map((phone, idx) => (
          <Text key={idx} style={styles.phoneNumber}>
            {phone.number}
          </Text>
        ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <InputField enteredText={search} onChangeText={(text) => setSearch(text)}>
        Search
      </InputField>

      <View style={styles.listContainer}>
        <Text style={styles.header}>Groups</Text>
        <FlatList
          data={contactsList.filter((contact) =>
            contact.name.toLowerCase().includes(search.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  listContainer: {
    marginVertical: 10,
  },
  contactContainer: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedContact: {
    backgroundColor: "#e0f7fa", // Highlight color for selected contacts
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phoneNumber: {
    fontSize: 16,
    color: "#555",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AddExpenses;
