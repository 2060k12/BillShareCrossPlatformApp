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
      <Stack>
        <Stack.screen name="index" options={{ headerTitle: "Login" }} />
        <Stack.screen name="login/login" />
        <Stack.screen name="login/signUp" />
      </Stack>
    </AuthContext.Provider>
  );
}
