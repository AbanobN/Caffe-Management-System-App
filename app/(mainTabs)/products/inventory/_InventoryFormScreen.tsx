import React from "react";
import {
    Text
} from "react-native";


import DangerButton from "@/components/ui/dangerButton";
import FormScreenLayout from "@/components/ui/formScreenLayout";
import FormTextField from "@/components/ui/formTextField";
import InfoCard from "@/components/ui/infoCard";
import PrimaryButton from "@/components/ui/primaryButton";

import { useInventoryItemForm } from "../../../../hooks/forms/useInventoryItemForm";

export default function InventoryFormScreen() {
    const {
        isEditMode,
        loading,
        name,
        bigUnitName,
        smallUnitName,
        convertRatio,
        purchasePricePerBigUnit,
        stockInfo,
        setName,
        setBigUnitName,
        setSmallUnitName,
        setConvertRatio,
        setPurchasePricePerBigUnit,
        handleSave,
        handleDelete,
    } = useInventoryItemForm();

    return (
        <FormScreenLayout
            title={isEditMode ? "Inventory Item Details" : "New Inventory Item"}
        >
            <FormTextField
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Sugar, Coffee, Milk..."
            />

            <FormTextField
                label="Big Unit Name (e.g. kg, liter)"
                value={bigUnitName}
                onChangeText={setBigUnitName}
                placeholder="kg, liter"
            />

            <FormTextField
                label="Small Unit Name (e.g. g, ml)"
                value={smallUnitName}
                onChangeText={setSmallUnitName}
                placeholder="g, ml"
            />

            <FormTextField
                label="Convert Ratio (1 big unit = ? small units)"
                value={convertRatio}
                onChangeText={setConvertRatio}
                placeholder="1000"
                keyboardType="numeric"
            />

            <FormTextField
                label="Purchase Price per Big Unit"
                value={purchasePricePerBigUnit}
                onChangeText={setPurchasePricePerBigUnit}
                placeholder="e.g. 120 (EGP per kg)"
                keyboardType="numeric"
            />

            {isEditMode && stockInfo && (
                <InfoCard title="Current Stock">
                    <Text>
                        Total small units: {stockInfo.currentStockSmall} {smallUnitName}
                    </Text>
                    <Text>
                        Breakdown: {stockInfo.stockBigUnit} {bigUnitName} +{" "}
                        {stockInfo.stockSmallRemainder} {smallUnitName}
                    </Text>
                </InfoCard>
            )}

            <PrimaryButton
                onPress={handleSave}
                disabled={loading}
                label={
                    isEditMode ? "Save (Not implemented yet)" : "Add Inventory Item"
                }
            />

            {isEditMode && (
                <DangerButton
                    onPress={handleDelete}
                    disabled={loading}
                    label="Delete Item"
                />
            )}
        </FormScreenLayout>
    );
}
