import { Stack, Tabs } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./../config/firebaseConfig";

export default function _layout() {
  const fbApp = initializeApp(firebaseConfig);
  const auth = getAuth(fbApp);

  return (
    <AuthContext.Provider value={auth}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: "Login" }} />
        <Stack.Screen name="login/login" />
        <Stack.Screen name="login/signUp" />
        <Stack.Screen name="addExpensesDetails" />
      </Stack>
    </AuthContext.Provider>
  );
}
