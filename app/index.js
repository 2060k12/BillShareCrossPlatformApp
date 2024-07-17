import React from "react";
import { View, Text } from "react-native";
import { FilledButton } from "../components/Button";
import { router } from "expo-router";
import LoginScreen from "../screens/LoginScreen";
export default function index() {
  return (
    <View>
      <LoginScreen />
    </View>
  );
}
