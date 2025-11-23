import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import type { MenuItemWithCost } from "../../../../services/menuService";
import { getMenuListWithCost } from "../../../../services/menuService";

import Screen from "../../../../components/ui/Screen";
import SectionTitle from "../../../../components/ui/SectionTitle";

export default function MenuItemsScreen() {
  const [items, setItems] = useState<MenuItemWithCost[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getMenuListWithCost({ onlyActive: false });
      setItems(data);
    } catch (err) {
      console.error("Failed to load menu list", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderItem = ({ item }: { item: MenuItemWithCost }) => {
    const { menuItem, costPerUnit, profitPerUnit, profitMarginPercent } = item;

    return (
      <Link
        href={{
          pathname: "/(mainTabs)/products/menuItems/[id]",
          params: { id: String(menuItem.id) },
        }}
        asChild
      >
        <Pressable
          style={{
            padding: 12,
            marginBottom: 8,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#ddd",
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {menuItem.name}
          </Text>

          {menuItem.category ? (
            <Text style={{ marginTop: 2, fontSize: 12, color: "#666" }}>
              {menuItem.category}
            </Text>
          ) : null}

          <View style={{ marginTop: 6 }}>
            <Text>Sell Price: {menuItem.sellPrice} EGP</Text>

            {costPerUnit != null && (
              <Text style={{ marginTop: 2, fontSize: 12 }}>
                Cost: {costPerUnit} EGP
              </Text>
            )}

            {profitPerUnit != null && (
              <Text style={{ marginTop: 2, fontSize: 12 }}>
                Profit: {profitPerUnit} EGP
                {profitMarginPercent != null
                  ? ` (${profitMarginPercent}%)`
                  : ""}
              </Text>
            )}
          </View>

          {!menuItem.isActive && (
            <Text
              style={{
                marginTop: 4,
                fontSize: 11,
                color: "red",
              }}
            >
              Inactive
            </Text>
          )}
        </Pressable>
      </Link>
    );
  };

  return (
    <Screen>
      <SectionTitle>Menu Items</SectionTitle>

      {loading ? (
        <View style={{ marginTop: 32, alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          style={{ marginTop: 16 }}
          data={items}
          keyExtractor={(item) => String(item.menuItem.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text
              style={{
                marginTop: 16,
                textAlign: "center",
                color: "#666",
              }}
            >
              لا يوجد منتجات حالياً. اضغط زر الإضافة لإضافة أول منتج.
            </Text>
          }
        />
      )}

      {/* زر عائم لإضافة منتج جديد */}
      <Link href="/(mainTabs)/products/menuItems/new" asChild>
        <Pressable
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#1e90ff",
            alignItems: "center",
            justifyContent: "center",
            elevation: 4,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 28 }}>＋</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}
