import { Stack } from "expo-router";


export default function MenuItemsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: "Menu Items" }}
      />
      <Stack.Screen
        name="new"
        options={{ title: "New Menu Item" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Menu Item Details" }}
      />
    </Stack>
  );
}
