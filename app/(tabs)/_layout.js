import { Tabs } from "expo-router";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../config/firebaseConfig";
import { FirestoreContext } from "../../contexts/FireStoreContext";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";

export default function _layout() {
  // firebase auth
  const fbApp = initializeApp(firebaseConfig);
  const auth = getAuth(fbApp);

  // firebase database
  const firebase = initializeApp(firebaseConfig);
  const db = getFirestore(firebase);
  return (
    <FirestoreContext.Provider value={db}>
      <AuthContext.Provider value={auth}>
        <Tabs screenOptions={{ tabBarShowLabel: false }}>
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="home" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="groups"
            options={{
              title: "Groups",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="group" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="add"
            options={{
              title: "Add Expences",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="plus-square-o" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="notifications"
            options={{
              title: "Notification",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="bell" size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="user" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </AuthContext.Provider>
    </FirestoreContext.Provider>
  );
}
