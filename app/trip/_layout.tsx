import { Stack } from "expo-router";

export default function TripLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="active" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
