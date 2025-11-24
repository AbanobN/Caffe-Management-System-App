import { Stack } from "expo-router";

export default function ProductsRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Menu Items Stack */}
      <Stack.Screen
        name="index"
        options={{ title: "Products" }}
      />

      {/* Menu Items Stack */}
      <Stack.Screen
        name="menuItems"
        options={{ title: "Menu Items" }}
      />

      {/* Inventory Stack */}
      <Stack.Screen
        name="inventory"
        options={{ title: "Inventory" }}
      />
    </Stack>
  );
}

