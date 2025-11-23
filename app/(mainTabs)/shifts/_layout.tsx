import { Stack } from "expo-router";

export default function ShiftsLayout() {
  return (
    <Stack screenOptions={{headerShown: false}} >
      <Stack.Screen
        name="index"
        options={{ title: "Shifts" }}
      />
      <Stack.Screen
        name="new"
        options={{ title: "New Shift" }}
      />
    </Stack>
  );
}
