import { Stack, Tabs } from "expo-router";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../config/firebaseConfig";
import { FirestoreContext } from "../../contexts/FireStoreContext";

export default function _layout() {
  const firebase = initializeApp(firebaseConfig);
  const db = getFirestore(firebase);
  return (
    <FirestoreContext.Provider value={db}>
      <Tabs>
        <Stack.screen name="index" />
        <Stack.screen name="profile" />
      </Tabs>
    </FirestoreContext.Provider>
  );
}
