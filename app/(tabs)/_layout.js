import { Stack, Tabs } from "expo-router";

export default function _layout() {
  return (
    // <Stack>
    <Tabs>
      <Stack.screen name="index" />
      <Stack.screen name="profile" />
    </Tabs>
    // </Stack>
  );
}
