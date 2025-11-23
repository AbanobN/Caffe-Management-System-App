import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import Screen from "../../../components/ui/Screen";

export default function ProductsHome() {
    return (
        <Screen>
            <Link href="/(mainTabs)/products/menuItems" asChild>
                <Pressable style={{ padding: 16, backgroundColor: "#eee", marginBottom: 12 }}>
                    <Text style={{ fontSize: 18 }}>Menu Items</Text>
                </Pressable>
            </Link>

            <Link href="/(mainTabs)/products/inventory" asChild>
                <Pressable style={{ padding: 16, backgroundColor: "#eee" }}>
                    <Text style={{ fontSize: 18 }}>Inventory</Text>
                </Pressable>
            </Link>
        </Screen>
    );
}
