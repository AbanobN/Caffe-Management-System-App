import { Text, View } from "react-native";
import Screen from "../../components/ui/Screen";
import SectionTitle from "../../components/ui/SectionTitle";

export default function HomeScreen() {
  return (
    <Screen>
      <SectionTitle>Bondok Caffee Dashboard</SectionTitle>

      <View style={{ gap: 12, marginTop: 8 }}>
        <Text>🔹 إجمالي مبيعات اليوم: 0 EGP (placeholder)</Text>
        <Text>🔹 عدد الشيفتات المفتوحة: 0</Text>
        <Text>🔹 إجمالي الديون: 0 EGP</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: "bold" }}>Tip:</Text>
        <Text>
          دي النسخة الـ MVP عشان تمشي ال flow: Products / Shifts / Suppliers،
          وبعدها نربط Backend أو Supabase.
        </Text>
      </View>
    </Screen>
  );
}
