import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import Screen from "../../../components/ui/Screen";

export default function SupplierDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <Screen>
            <Text>Supplier details page for ID: {id}</Text>
            <Text>هنا بعدين هنجيب بيانات المورد من الـ API.</Text>
        </Screen>
    );
}