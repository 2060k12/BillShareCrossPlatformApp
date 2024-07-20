import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import { collection, getDocs } from "firebase/firestore";
import User from "../../data/UserDetails";

const HomePage = () => {
  const db = useContext(FirestoreContext);
  const [arrayOfUsers, setArrayOfUsers] = useState([]);

  async function getDatabase() {
    try {
      const tempArr = [];
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        const user = new User(
          doc.id,
          doc.data().name,
          doc.data().email,
          doc.data().phoneNumber,
          doc.data().imageUrl
        );
        tempArr.push(user);
        console.log(doc.data());
      });
      setArrayOfUsers(tempArr);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDatabase();
  }, []);

  return (
    <View>
      <FlatList
        // keyExtractor={(item) => item.id}
        data={arrayOfUsers}
        renderItem={({ item }) => (
          <View>
            <Text>{item.id}</Text>
            <Text>{item.name}</Text>
            <Text>{item.phoneNumber}</Text>
            <Text>{item.email}</Text>
            <Text>{item.imageUrl}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HomePage;
