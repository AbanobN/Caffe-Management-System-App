import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import Screen from "../../../components/ui/Screen";
import SectionTitle from "../../../components/ui/SectionTitle";
import type { Shift } from "../../../models/shift";
// import { getShifts } from "@/services/api";

export default function ShiftsScreen() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    getShifts().then(setShifts);
  }, []);

  return (
    <Screen>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <SectionTitle>Shifts</SectionTitle>

        <Link href="/(mainTabs)/shifts/new" asChild>
          <Button title="New Shift" />
        </Link>
      </View>

      <FlatList
        data={shifts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginBottom: 8,
              borderWidth: 1,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.workerName}</Text>
            <Text>Start: {item.startTime}</Text>
            <Text>Cash: {item.cash} EGP</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No shifts yet (seed data only).</Text>}
      />
    </Screen>
  );
}
