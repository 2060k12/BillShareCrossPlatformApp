import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Stack>
      <Stack.screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.screen name="index" options={{ headerTitle: "Login" }} />
      <Stack.screen name="login/login" />
      <Stack.screen name="login/signUp" />
    </Stack>
  );
}
