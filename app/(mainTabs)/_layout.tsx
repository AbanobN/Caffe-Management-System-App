import { Tabs } from "expo-router";

export default function MainTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
        }}
      />

      <Tabs.Screen
        name="shifts"
        options={{
          title: "Shifts",
        }}
      />

      <Tabs.Screen
        name="suppliers"
        options={{
          title: "Suppliers",
        }}
      />
    </Tabs>
  );
}
