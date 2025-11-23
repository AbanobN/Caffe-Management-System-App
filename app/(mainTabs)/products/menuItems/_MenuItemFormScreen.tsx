// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//     Alert,
//     Pressable,
//     ScrollView,
//     Switch,
//     Text,
//     TextInput,
//     View,
// } from 'react-native';

// import {
//     createMenuItemWithIngredients,
//     deleteMenuItemWithIngredients,
//     getMenuItemDetails,
//     updateMenuItemWithIngredients,
//     type CreateMenuItemServiceInput,
//     type UpdateMenuItemServiceInput,
// } from '../../../services/menuService';

// import Screen from '../../../components/ui/Screen';
// import SectionTitle from '../../../components/ui/SectionTitle';

// export default function ProductFormScreen() {
//     const router = useRouter();
//     const { id } = useLocalSearchParams<{ id?: string }>();

//     const isEditMode = !!id;

//     const [loading, setLoading] = useState(false);

//     const [name, setName] = useState('');
//     const [category, setCategory] = useState('');
//     const [sellPrice, setSellPrice] = useState('');
//     const [isActive, setIsActive] = useState(true);

//     const [costInfo, setCostInfo] = useState<{
//         costPerUnit: number | null;
//         profitPerUnit: number | null;
//         profitMarginPercent: number | null;
//     } | null>(null);

//     // تحميل بيانات المنتج في وضع التعديل
//     useEffect(() => {
//         if (!isEditMode || !id) return;

//         (async () => {
//             try {
//                 setLoading(true);
//                 const details = await getMenuItemDetails(Number(id));

//                 if (!details) {
//                     Alert.alert('خطأ', 'المنتج غير موجود');
//                     router.back();
//                     return;
//                 }

//                 const { menuItem, costPerUnit, profitPerUnit, profitMarginPercent } =
//                     details;

//                 setName(menuItem.name);
//                 setCategory(menuItem.category ?? '');
//                 setSellPrice(String(menuItem.sellPrice));
//                 setIsActive(menuItem.isActive ?? true);

//                 setCostInfo({
//                     costPerUnit,
//                     profitPerUnit,
//                     profitMarginPercent,
//                 });
//             } catch (error) {
//                 console.error('Failed to load menu item details', error);
//                 Alert.alert('خطأ', 'حصل خطأ أثناء تحميل بيانات المنتج.');
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, [id, isEditMode, router]);

//     const handleSave = async () => {
//         if (!name.trim() || !sellPrice.trim()) {
//             Alert.alert('تنبيه', 'الاسم والسعر مطلوبين');
//             return;
//         }

//         const numericPrice = Number(sellPrice);
//         if (Number.isNaN(numericPrice) || numericPrice <= 0) {
//             Alert.alert('تنبيه', 'السعر يجب أن يكون رقمًا أكبر من 0');
//             return;
//         }

//         try {
//             setLoading(true);

//             if (isEditMode && id) {
//                 const payload: UpdateMenuItemServiceInput = {
//                     id: Number(id),
//                     name,
//                     category,
//                     sellPrice: numericPrice,
//                     isActive,
//                     // تقدر تضيف ingredients هنا بعدين
//                 };

//                 await updateMenuItemWithIngredients(payload);
//             } else {
//                 const payload: CreateMenuItemServiceInput = {
//                     name,
//                     category,
//                     sellPrice: numericPrice,
//                     isActive,
//                     ingredients: [], // حاليًا بدون Recipe
//                 };

//                 await createMenuItemWithIngredients(payload);
//             }

//             router.back();
//         } catch (error) {
//             console.error('Failed to save menu item', error);
//             Alert.alert('خطأ', 'حصل خطأ أثناء الحفظ، حاول مرة أخرى.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async () => {
//         if (!isEditMode || !id) {
//             console.log('Not in edit mode or no id, skip delete');
//             return;
//         }

//         Alert.alert('حذف المنتج', 'هل أنت متأكد من حذف هذا المنتج؟', [
//             { text: 'إلغاء', style: 'cancel' },
//             {
//                 text: 'حذف',
//                 style: 'destructive',
//                 onPress: async () => {
//                     try {
//                         setLoading(true);
//                         await deleteMenuItemWithIngredients(Number(id));
//                         router.back();
//                     } catch (error) {
//                         console.error('Failed to delete menu item', error);
//                         Alert.alert('خطأ', 'حصل خطأ أثناء الحذف.');
//                     } finally {
//                         setLoading(false);
//                     }
//                 },
//             },
//         ]);
//     };

//     return (
//         <Screen>
//             <SectionTitle>
//                 {isEditMode ? 'Edit Product' : 'New Product'}
//             </SectionTitle>

//             <ScrollView style={{ marginTop: 16 }}>
//                 <View style={{ gap: 14 }}>
//                     <View>
//                         <Text style={{ marginBottom: 4 }}>Name</Text>
//                         <TextInput
//                             value={name}
//                             onChangeText={setName}
//                             placeholder="Latte, Espresso..."
//                             style={{
//                                 borderWidth: 1,
//                                 borderColor: '#ccc',
//                                 borderRadius: 8,
//                                 paddingHorizontal: 12,
//                                 paddingVertical: 8,
//                             }}
//                         />
//                     </View>

//                     <View>
//                         <Text style={{ marginBottom: 4 }}>Category</Text>
//                         <TextInput
//                             value={category}
//                             onChangeText={setCategory}
//                             placeholder="Hot Drinks, Cold Drinks..."
//                             style={{
//                                 borderWidth: 1,
//                                 borderColor: '#ccc',
//                                 borderRadius: 8,
//                                 paddingHorizontal: 12,
//                                 paddingVertical: 8,
//                             }}
//                         />
//                     </View>

//                     <View>
//                         <Text style={{ marginBottom: 4 }}>Sell Price (EGP)</Text>
//                         <TextInput
//                             value={sellPrice}
//                             onChangeText={setSellPrice}
//                             placeholder="50"
//                             keyboardType="numeric"
//                             style={{
//                                 borderWidth: 1,
//                                 borderColor: '#ccc',
//                                 borderRadius: 8,
//                                 paddingHorizontal: 12,
//                                 paddingVertical: 8,
//                             }}
//                         />
//                     </View>

//                     <View
//                         style={{
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             justifyContent: 'space-between',
//                             marginTop: 8,
//                         }}
//                     >
//                         <Text>Active</Text>
//                         <Switch value={isActive} onValueChange={setIsActive} />
//                     </View>

//                     {isEditMode && costInfo && (
//                         <View
//                             style={{
//                                 marginTop: 16,
//                                 padding: 12,
//                                 borderRadius: 8,
//                                 backgroundColor: '#f5f5f5',
//                             }}
//                         >
//                             <Text style={{ fontWeight: '600', marginBottom: 4 }}>
//                                 Cost & Profit
//                             </Text>
//                             <Text>
//                                 Cost per unit:{' '}
//                                 {costInfo.costPerUnit != null
//                                     ? `${costInfo.costPerUnit} EGP`
//                                     : 'N/A'}
//                             </Text>
//                             <Text>
//                                 Profit per unit:{' '}
//                                 {costInfo.profitPerUnit != null
//                                     ? `${costInfo.profitPerUnit} EGP`
//                                     : 'N/A'}
//                             </Text>
//                             <Text>
//                                 Profit margin:{' '}
//                                 {costInfo.profitMarginPercent != null
//                                     ? `${costInfo.profitMarginPercent}%`
//                                     : 'N/A'}
//                             </Text>
//                         </View>
//                     )}

//                     <Pressable
//                         onPress={handleSave}
//                         disabled={loading}
//                         style={{
//                             marginTop: 16,
//                             backgroundColor: '#1e90ff',
//                             paddingVertical: 12,
//                             borderRadius: 8,
//                             alignItems: 'center',
//                         }}
//                     >
//                         <Text
//                             style={{
//                                 color: '#fff',
//                                 fontWeight: '600',
//                                 fontSize: 16,
//                             }}
//                         >
//                             {isEditMode ? 'Save Changes' : 'Add Product'}
//                         </Text>
//                     </Pressable>

//                     {isEditMode && (
//                         <Pressable
//                             onPress={handleDelete}
//                             disabled={loading}
//                             style={{
//                                 marginTop: 8,
//                                 backgroundColor: '#ff4d4f',
//                                 paddingVertical: 12,
//                                 borderRadius: 8,
//                                 alignItems: 'center',
//                             }}
//                         >
//                             <Text
//                                 style={{
//                                     color: '#fff',
//                                     fontWeight: '600',
//                                     fontSize: 16,
//                                 }}
//                             >
//                                 Delete Product
//                             </Text>
//                         </Pressable>
//                     )}
//                 </View>
//             </ScrollView>
//         </Screen>
//     );
// }

// app/(mainTabs)/products/_ProductFormScreen.tsx

import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    createMenuItemWithIngredients,
    deleteMenuItemWithIngredients,
    getMenuItemDetails,
    updateMenuItemWithIngredients,
    type CreateMenuItemServiceInput,
    type UpdateMenuItemServiceInput,
} from '../../../../services/menuService';

import type { InventoryItem } from '../../../../models/inventory';
// عدّل اسم الفنكشن لو مختلف عندك في الريبو
import { getAllInventoryItems } from '../../../../db/repositories/inventoryRepository';

import Screen from '../../../../components/ui/Screen';
import SectionTitle from '../../../../components/ui/SectionTitle';

type IngredientRow = {
    localId: string;
    inventoryItemId: number | null;
    quantitySmallUsed: string; // نخزنها كـ string للـ TextInput
};

export default function MenuItemsFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [costInfo, setCostInfo] = useState<{
        costPerUnit: number | null;
        profitPerUnit: number | null;
        profitMarginPercent: number | null;
    } | null>(null);

    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([]);

    // تحميل الـ inventory عشان نستخدمه في الـ dropdown
    useEffect(() => {
        (async () => {
            try {
                const items = await getAllInventoryItems();
                setInventoryItems(items);
            } catch (error) {
                console.error('Failed to load inventory items for recipe editor', error);
            }
        })();
    }, []);

    // Helper لإنشاء localId بسيط
    const createLocalId = () => Math.random().toString(36).slice(2);

    // تحميل بيانات المنتج في وضع التعديل
    useEffect(() => {
        if (!isEditMode || !id) return;

        (async () => {
            try {
                setLoading(true);
                const details = await getMenuItemDetails(Number(id));

                if (!details) {
                    Alert.alert('خطأ', 'المنتج غير موجود');
                    router.back();
                    return;
                }

                const {
                    menuItem,
                    costPerUnit,
                    profitPerUnit,
                    profitMarginPercent,
                    ingredients,
                } = details;

                setName(menuItem.name);
                setCategory(menuItem.category ?? '');
                setSellPrice(String(menuItem.sellPrice));
                setIsActive(menuItem.isActive ?? true);

                setCostInfo({
                    costPerUnit,
                    profitPerUnit,
                    profitMarginPercent,
                });

                // حوّل الـ ingredients من الـ DB لـ rows في الـ UI
                const rows: IngredientRow[] = ingredients.map((ing) => ({
                    localId: createLocalId(),
                    inventoryItemId: ing.inventoryItemId,
                    quantitySmallUsed: String(ing.quantitySmallUsed),
                }));
                setIngredientRows(rows);
            } catch (error) {
                console.error('Failed to load menu item details', error);
                Alert.alert('خطأ', 'حصل خطأ أثناء تحميل بيانات المنتج.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id, isEditMode, router]);

    const addIngredientRow = () => {
        setIngredientRows((prev) => [
            ...prev,
            {
                localId: createLocalId(),
                inventoryItemId: null,
                quantitySmallUsed: '',
            },
        ]);
    };

    const updateIngredientRow = (
        localId: string,
        updates: Partial<IngredientRow>
    ) => {
        setIngredientRows((prev) =>
            prev.map((row) =>
                row.localId === localId ? { ...row, ...updates } : row
            )
        );
    };

    const removeIngredientRow = (localId: string) => {
        setIngredientRows((prev) =>
            prev.filter((row) => row.localId !== localId)
        );
    };

    const buildIngredientsPayload = () => {
        return ingredientRows
            .filter(
                (row) =>
                    row.inventoryItemId != null &&
                    row.quantitySmallUsed.trim() !== '' &&
                    !Number.isNaN(Number(row.quantitySmallUsed)) &&
                    Number(row.quantitySmallUsed) > 0
            )
            .map((row) => ({
                inventoryItemId: row.inventoryItemId as number,
                quantitySmallUsed: Number(row.quantitySmallUsed),
            }));
    };

    const handleSave = async () => {
        if (!name.trim() || !sellPrice.trim()) {
            Alert.alert('تنبيه', 'الاسم والسعر مطلوبين');
            return;
        }

        const numericPrice = Number(sellPrice);
        if (Number.isNaN(numericPrice) || numericPrice <= 0) {
            Alert.alert('تنبيه', 'السعر يجب أن يكون رقمًا أكبر من 0');
            return;
        }

        const ingredientsPayload = buildIngredientsPayload();

        try {
            setLoading(true);

            if (isEditMode && id) {
                const payload: UpdateMenuItemServiceInput = {
                    id: Number(id),
                    name,
                    category,
                    sellPrice: numericPrice,
                    isActive,
                    ingredients: ingredientsPayload,
                };

                await updateMenuItemWithIngredients(payload);
            } else {
                const payload: CreateMenuItemServiceInput = {
                    name,
                    category,
                    sellPrice: numericPrice,
                    isActive,
                    ingredients: ingredientsPayload,
                };

                await createMenuItemWithIngredients(payload);
            }

            router.back();
        } catch (error) {
            console.error('Failed to save menu item', error);
            Alert.alert('خطأ', 'حصل خطأ أثناء الحفظ، حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditMode || !id) return;

        Alert.alert('حذف المنتج', 'هل أنت متأكد من حذف هذا المنتج؟', [
            { text: 'إلغاء', style: 'cancel' },
            {
                text: 'حذف',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setLoading(true);
                        await deleteMenuItemWithIngredients(Number(id));
                        router.back();
                    } catch (error) {
                        console.error('Failed to delete menu item', error);
                        Alert.alert('خطأ', 'حصل خطأ أثناء الحذف.');
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
                {isEditMode ? 'Edit Product' : 'New Product'}
            </SectionTitle>

            <ScrollView style={{ marginTop: 16 }}>
                <View style={{ gap: 14 }}>
                    {/* Basic fields */}
                    <View>
                        <Text style={{ marginBottom: 4 }}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Latte, Espresso..."
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        />
                    </View>

                    <View>
                        <Text style={{ marginBottom: 4 }}>Category</Text>
                        <TextInput
                            value={category}
                            onChangeText={setCategory}
                            placeholder="Hot Drinks, Cold Drinks..."
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        />
                    </View>

                    <View>
                        <Text style={{ marginBottom: 4 }}>Sell Price (EGP)</Text>
                        <TextInput
                            value={sellPrice}
                            onChangeText={setSellPrice}
                            placeholder="50"
                            keyboardType="numeric"
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 8,
                        }}
                    >
                        <Text>Active</Text>
                        <Switch value={isActive} onValueChange={setIsActive} />
                    </View>

                    {/* Ingredients / Recipe Editor */}
                    <View style={{ marginTop: 16 }}>
                        <Text style={{ fontWeight: '600', marginBottom: 8 }}>
                            Ingredients (Recipe)
                        </Text>

                        {ingredientRows.map((row, index) => (
                            <View
                                key={row.localId}
                                style={{
                                    marginBottom: 12,
                                    padding: 10,
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    borderColor: '#ddd',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <Text style={{ marginBottom: 4 }}>
                                    Ingredient {index + 1}
                                </Text>

                                {/* اختيار الصنف من الـ Inventory */}
                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Picker
                                        selectedValue={row.inventoryItemId ?? undefined}
                                        onValueChange={(value) =>
                                            updateIngredientRow(row.localId, {
                                                inventoryItemId: value ? Number(value) : null,
                                            })
                                        }
                                    >
                                        <Picker.Item
                                            label="Select inventory item..."
                                            value={undefined}
                                        />
                                        {inventoryItems.map((item) => (
                                            <Picker.Item
                                                key={item.id}
                                                label={item.name}
                                                value={item.id}
                                            />
                                        ))}
                                    </Picker>
                                </View>

                                {/* الكمية المستخدمة بالوحدة الصغيرة */}
                                <View>
                                    <Text style={{ marginBottom: 4 }}>Qty (small unit)</Text>
                                    <TextInput
                                        value={row.quantitySmallUsed}
                                        onChangeText={(text) =>
                                            updateIngredientRow(row.localId, {
                                                quantitySmallUsed: text,
                                            })
                                        }
                                        placeholder="e.g. 15 (ml / g)"
                                        keyboardType="numeric"
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            borderRadius: 8,
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                        }}
                                    />
                                </View>

                                <Pressable
                                    onPress={() => removeIngredientRow(row.localId)}
                                    style={{
                                        marginTop: 8,
                                        alignSelf: 'flex-end',
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 6,
                                        backgroundColor: '#ff4d4f',
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 12 }}>
                                        Remove
                                    </Text>
                                </Pressable>
                            </View>
                        ))}

                        <Pressable
                            onPress={addIngredientRow}
                            style={{
                                marginTop: 4,
                                paddingVertical: 10,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#1e90ff',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#1e90ff', fontWeight: '600' }}>
                                + Add Ingredient
                            </Text>
                        </Pressable>
                    </View>

                    {/* Cost & Profit (read-only في edit mode) */}
                    {isEditMode && costInfo && (
                        <View
                            style={{
                                marginTop: 16,
                                padding: 12,
                                borderRadius: 8,
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                                Cost & Profit
                            </Text>
                            <Text>
                                Cost per unit:{' '}
                                {costInfo.costPerUnit != null
                                    ? `${costInfo.costPerUnit} EGP`
                                    : 'N/A'}
                            </Text>
                            <Text>
                                Profit per unit:{' '}
                                {costInfo.profitPerUnit != null
                                    ? `${costInfo.profitPerUnit} EGP`
                                    : 'N/A'}
                            </Text>
                            <Text>
                                Profit margin:{' '}
                                {costInfo.profitMarginPercent != null
                                    ? `${costInfo.profitMarginPercent}%`
                                    : 'N/A'}
                            </Text>
                        </View>
                    )}

                    {/* Save / Delete buttons */}
                    <Pressable
                        onPress={handleSave}
                        disabled={loading}
                        style={{
                            marginTop: 16,
                            backgroundColor: '#1e90ff',
                            paddingVertical: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: 16,
                            }}
                        >
                            {isEditMode ? 'Save Changes' : 'Add Product'}
                        </Text>
                    </Pressable>

                    {isEditMode && (
                        <Pressable
                            onPress={handleDelete}
                            disabled={loading}
                            style={{
                                marginTop: 8,
                                backgroundColor: '#ff4d4f',
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: 16,
                                }}
                            >
                                Delete Product
                            </Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </Screen>
    );
}
