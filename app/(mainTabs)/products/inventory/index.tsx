import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

import {
    getInventoryWithBreakdown,
    type InventoryItemWithBreakdown,
} from "../../../../services/inventoryService";

import Screen from "../../../../components/ui/Screen";
import SectionTitle from "../../../../components/ui/SectionTitle";

export default function InventoryScreen() {
    const [items, setItems] = useState<InventoryItemWithBreakdown[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getInventoryWithBreakdown();
            setItems(data);
        } catch (err) {
            console.error("Failed to load inventory list", err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const renderItem = ({ item }: { item: InventoryItemWithBreakdown }) => {
        return (
            <Link
                href={{
                    pathname: "/(mainTabs)/products/inventory/[id]",
                    params: { id: String(item.id) },
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
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>

                    <Text style={{ marginTop: 4, fontSize: 13 }}>
                        Stock: {item.stockBigUnit} {item.bigUnitName} +{" "}
                        {item.stockSmallRemainder} {item.smallUnitName}
                    </Text>

                    <Text style={{ marginTop: 2, fontSize: 12, color: "#666" }}>
                        1 {item.bigUnitName} = {item.convertRatio} {item.smallUnitName}
                    </Text>

                    <Text style={{ marginTop: 2, fontSize: 12 }}>
                        Purchase price: {item.purchasePricePerBigUnit} / {item.bigUnitName}
                    </Text>
                </Pressable>
            </Link>
        );
    };

    return (
        <Screen>
            <SectionTitle>Inventory Items</SectionTitle>

            {loading ? (
                <View style={{ marginTop: 32, alignItems: "center" }}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    style={{ marginTop: 16 }}
                    data={items}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <Text
                            style={{
                                marginTop: 16,
                                textAlign: "center",
                                color: "#666",
                            }}
                        >
                            لا يوجد أصناف في المخزون حالياً. اضغط زر الإضافة لإضافة أول صنف.
                        </Text>
                    }
                />
            )}

            {/* زر عائم لإضافة صنف جديد */}
            <Link href="/(mainTabs)/products/inventory/new" asChild>
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
