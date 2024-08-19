import { Stack, Tabs } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./../config/firebaseConfig";

export default function _layout() {
  // firebase auth
  const fbApp = initializeApp(firebaseConfig);
  const auth = getAuth(fbApp);

  return (
    // Provide the auth context to the app
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
        <Stack.Screen name="expensesDetails/[id]" />
        <Stack.Screen name="setting" />
        <Stack.Screen name="history" />
      </Stack>
    </AuthContext.Provider>
  );
}
