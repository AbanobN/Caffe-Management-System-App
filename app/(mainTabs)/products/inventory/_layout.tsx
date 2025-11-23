import { Stack } from "expo-router";

export default function InventoryLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{ title: "Inventory" }}
            />
            <Stack.Screen
                name="new"
                options={{ title: "New Inventory Item" }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: "Inventory Details" }}
            />
        </Stack>
    );
}
