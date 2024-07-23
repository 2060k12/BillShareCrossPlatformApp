import { useState, useLayoutEffect } from "react";
import { View, Text, Button } from "react-native";
import InputField from "../../components/InputField";
import { useNavigation } from "expo-router";

const AddExpenses = () => {
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  // when add button is pressed
  function addButtonListener() {
    navigation.navigate("addExpensesDetails");
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Add" onPress={addButtonListener} />,
    });
  }, [navigation]);
  return (
    <View style={{ margin: 16 }}>
      <InputField enteredText={search} onChangeText={(text) => setSearch(text)}>
        Search
      </InputField>

      <View style={{ minHeight: 100 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Groups</Text>
      </View>

      <View style={{ minHeight: 100 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Friends</Text>
      </View>
    </View>
  );
};

export default AddExpenses;
