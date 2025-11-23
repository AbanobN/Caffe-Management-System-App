import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Screen from "../../../components/ui/Screen";
import SectionTitle from "../../../components/ui/SectionTitle";
import type { Supplier } from "../../../models/supplier";
import { getSuppliers } from "../../../services/api";

export default function SuppliersScreen() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
  }, []);

  return (
    <Screen>
      <SectionTitle>Suppliers</SectionTitle>

      <FlatList
        style={{ marginTop: 16 }}
        data={suppliers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link
            href={`/(mainTabs)/suppliers/${item.id}`}
            asChild
          >
            <TouchableOpacity>
              <View
                style={{
                  padding: 12,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                <Text>Phone: {item.phone}</Text>
                <Text>Notes: {item.notes || "-"}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text>No suppliers yet.</Text>}
      />
    </Screen>
  );
}
