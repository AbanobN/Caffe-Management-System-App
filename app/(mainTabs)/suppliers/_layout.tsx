import { Stack } from "expo-router";

export default function SuppliersLayout() {
  return (
    <Stack screenOptions={{headerShown: false}} >
      <Stack.Screen
        name="index"
        options={{ title: "Suppliers" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Supplier Details" }}
      />
    </Stack>
  );
}
