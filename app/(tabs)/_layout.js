import { Stack, Tabs } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Tabs>
      <Stack.screen name="index" />
      <Stack.screen name="profile" />
    </Tabs>
  );
}
