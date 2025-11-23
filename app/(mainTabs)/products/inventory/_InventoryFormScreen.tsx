import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    createInventoryProduct,
    deleteInventoryProduct,
    getInventoryItemWithBreakdown,
    type CreateInventoryItemServiceInput,
} from "../../../../services/inventoryService";

import Screen from "../../../../components/ui/Screen";
import SectionTitle from "../../../../components/ui/SectionTitle";

export default function InventoryFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [bigUnitName, setBigUnitName] = useState("kg");
    const [smallUnitName, setSmallUnitName] = useState("g");
    const [convertRatio, setConvertRatio] = useState("1000");
    const [purchasePricePerBigUnit, setPurchasePricePerBigUnit] = useState("0");

    const [stockInfo, setStockInfo] = useState<{
        stockBigUnit: number;
        stockSmallRemainder: number;
        currentStockSmall: number;
    } | null>(null);

    useEffect(() => {
        if (!isEditMode || !id) return;

        (async () => {
            try {
                setLoading(true);
                const item = await getInventoryItemWithBreakdown(Number(id));
                if (!item) {
                    Alert.alert("خطأ", "الصنف غير موجود");
                    router.back();
                    return;
                }

                setName(item.name);
                setBigUnitName(item.bigUnitName);
                setSmallUnitName(item.smallUnitName);
                setConvertRatio(String(item.convertRatio));
                setPurchasePricePerBigUnit(String(item.purchasePricePerBigUnit ?? 0));

                setStockInfo({
                    stockBigUnit: item.stockBigUnit,
                    stockSmallRemainder: item.stockSmallRemainder,
                    currentStockSmall: item.currentStockSmall,
                });
            } catch (error) {
                console.error("Failed to load inventory item", error);
                Alert.alert("خطأ", "حصل خطأ أثناء تحميل بيانات الصنف.");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, isEditMode, router]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("تنبيه", "اسم الصنف مطلوب");
            return;
        }

        if (!bigUnitName.trim() || !smallUnitName.trim()) {
            Alert.alert("تنبيه", "وحدات القياس مطلوبة");
            return;
        }

        const ratioNum = Number(convertRatio);
        if (Number.isNaN(ratioNum) || ratioNum <= 0) {
            Alert.alert("تنبيه", "convertRatio يجب أن يكون رقم أكبر من 0");
            return;
        }

        const priceBigNum = Number(purchasePricePerBigUnit);
        if (Number.isNaN(priceBigNum) || priceBigNum < 0) {
            Alert.alert("تنبيه", "سعر شراء الوحدة الكبيرة يجب أن يكون رقمًا صحيحًا");
            return;
        }

        try {
            setLoading(true);

            if (isEditMode && id) {
                // في الـ SRD اللي عندنا، تحديث المخزون الأساسي بيتم عن طريق الـ purchases،
                // فحالياً مش هنحدثه هنا عشان منلغبطش الحسابات.
                // ممكن بعدين نضيف دالة updateInventoryProduct لو حابب.
                Alert.alert(
                    "تنبيه",
                    "تعديل بيانات الصنف الأساسية لم تُنفَّذ بعد (محتاجة updateInventoryProduct في الـ service)."
                );
            } else {
                const payload: CreateInventoryItemServiceInput = {
                    name,
                    bigUnitName,
                    smallUnitName,
                    convertRatio: ratioNum,
                    purchasePricePerBigUnit: priceBigNum,
                };

                await createInventoryProduct(payload);
                router.back();
            }
        } catch (error) {
            console.error("Failed to save inventory item", error);
            Alert.alert("خطأ", "حصل خطأ أثناء الحفظ، حاول مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditMode || !id) return;

        Alert.alert("حذف الصنف", "هل أنت متأكد من حذف هذا الصنف من المخزون؟", [
            { text: "إلغاء", style: "cancel" },
            {
                text: "حذف",
                style: "destructive",
                onPress: async () => {
                    try {
                        setLoading(true);
                        await deleteInventoryProduct(Number(id));
                        router.back();
                    } catch (error) {
                        console.error("Failed to delete inventory item", error);
                        Alert.alert("خطأ", "حصل خطأ أثناء الحذف.");
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    return (
        <Screen>
            <SectionTitle>
                {isEditMode ? "Inventory Item Details" : "New Inventory Item"}
            </SectionTitle>

            <ScrollView style={{ marginTop: 16 }}>
                <View style={{ gap: 14 }}>
                    <View>
                        <Text style={{ marginBottom: 4 }}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Sugar, Coffee, Milk..."
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        />
                    </View>

                    <View>
                        <Text style={{ marginBottom: 4 }}>Big Unit Name (e.g. kg, liter)</Text>
                        <TextInput
                            value={bigUnitName}
                            onChangeText={setBigUnitName}
                            placeholder="kg, liter"
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        />
                    </View>

                    <View>
                        <Text style={{ marginBottom: 4 }}>Small Unit Name (e.g. g, ml)</Text>
                        <TextInput
                            value={smallUnitName}
                            onChangeText={setSmallUnitName}
                            placeholder="g, ml"
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        />
                    </View>

                    <View>
                        <Text style={{ marginBottom: 4 }}>
                            Convert Ratio (1 big unit = ? small units)
                        </Text>
                        <TextInput
                            value={convertRatio}
                            onChangeText={setConvertRatio}
                            placeholder="1000"
                            keyboardType="numeric"
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        />
                    </View>

                    <View>
                        <Text style={{ marginBottom: 4 }}>
                            Purchase Price per Big Unit
                        </Text>
                        <TextInput
                            value={purchasePricePerBigUnit}
                            onChangeText={setPurchasePricePerBigUnit}
                            placeholder="e.g. 120 (EGP per kg)"
                            keyboardType="numeric"
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        />
                    </View>

                    {isEditMode && stockInfo && (
                        <View
                            style={{
                                marginTop: 16,
                                padding: 12,
                                borderRadius: 8,
                                backgroundColor: "#f5f5f5",
                            }}
                        >
                            <Text style={{ fontWeight: "600", marginBottom: 4 }}>
                                Current Stock
                            </Text>
                            <Text>
                                Total small units: {stockInfo.currentStockSmall} {smallUnitName}
                            </Text>
                            <Text>
                                Breakdown: {stockInfo.stockBigUnit} {bigUnitName} +{" "}
                                {stockInfo.stockSmallRemainder} {smallUnitName}
                            </Text>
                        </View>
                    )}

                    <Pressable
                        onPress={handleSave}
                        disabled={loading}
                        style={{
                            marginTop: 16,
                            backgroundColor: "#1e90ff",
                            paddingVertical: 12,
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: 16,
                            }}
                        >
                            {isEditMode ? "Save (Not implemented yet)" : "Add Inventory Item"}
                        </Text>
                    </Pressable>

                    {isEditMode && (
                        <Pressable
                            onPress={handleDelete}
                            disabled={loading}
                            style={{
                                marginTop: 8,
                                backgroundColor: "#ff4d4f",
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "600",
                                    fontSize: 16,
                                }}
                            >
                                Delete Item
                            </Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </Screen>
    );
}
