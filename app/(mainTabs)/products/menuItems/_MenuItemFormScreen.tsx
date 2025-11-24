import React from "react";
import { Switch, Text, View } from "react-native";

import RecipeEditor from "../../../../components/menu/recipeEditor";
import DangerButton from "../../../../components/ui/dangerButton";
import FormScreenLayout from "../../../../components/ui/formScreenLayout";
import FormTextField from "../../../../components/ui/formTextField";
import InfoCard from "../../../../components/ui/infoCard";
import PrimaryButton from "../../../../components/ui/primaryButton";

import { useMenuItemForm } from "../../../../hooks/forms/useMenuItemForm";

export default function MenuItemsFormScreen() {
    const {
        isEditMode,
        loading,
        name,
        category,
        sellPrice,
        isActive,
        costInfo,
        inventoryItems,
        ingredientRows,
        setName,
        setCategory,
        setSellPrice,
        setIsActive,
        addIngredientRow,
        updateIngredientRow,
        removeIngredientRow,
        handleSave,
        handleDelete,
    } = useMenuItemForm();

    return (
        <FormScreenLayout
            title={isEditMode ? "Edit Menu Item" : "New Menu Item"}
        >
            <FormTextField
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Latte, Espresso..."
            />

            <FormTextField
                label="Category"
                value={category}
                onChangeText={setCategory}
                placeholder="Hot Drinks, Cold Drinks..."
            />

            <FormTextField
                label="Sell Price (EGP)"
                value={sellPrice}
                onChangeText={setSellPrice}
                placeholder="50"
                keyboardType="numeric"
            />

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                }}
            >
                <Text>Active</Text>
                <Switch value={isActive} onValueChange={setIsActive} />
            </View>

            <RecipeEditor
                inventoryItems={inventoryItems}
                ingredientRows={ingredientRows}
                onAddRow={addIngredientRow}
                onUpdateRow={updateIngredientRow}
                onRemoveRow={removeIngredientRow}
            />

            {isEditMode && costInfo && (
                <InfoCard title="Cost & Profit">
                    <Text>
                        Cost per unit:{" "}
                        {costInfo.costPerUnit != null
                            ? `${costInfo.costPerUnit} EGP`
                            : "N/A"}
                    </Text>
                    <Text>
                        Profit per unit:{" "}
                        {costInfo.profitPerUnit != null
                            ? `${costInfo.profitPerUnit} EGP`
                            : "N/A"}
                    </Text>
                    <Text>
                        Profit margin:{" "}
                        {costInfo.profitMarginPercent != null
                            ? `${costInfo.profitMarginPercent}%`
                            : "N/A"}
                    </Text>
                </InfoCard>
            )}

            <PrimaryButton
                label={isEditMode ? "Save Changes" : "Add Product"}
                onPress={handleSave}
                disabled={loading}
            />

            {isEditMode && (
                <DangerButton
                    label="Delete Product"
                    onPress={handleDelete}
                    disabled={loading}
                />
            )}
        </FormScreenLayout>
    );
}
