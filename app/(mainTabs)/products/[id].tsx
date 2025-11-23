import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import Screen from "../../../components/ui/Screen";
import SectionTitle from "../../../components/ui/SectionTitle";
import type { Product } from "../../../models/product";
import { getProductById } from "../../../services/api";

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (id) {
            getProductById(Number(id)).then((p) => {
                setProduct(p ?? null);
            });
        }
    }, [id]);

    if (!product) {
        return (
            <Screen>
                <Text>Product not found.</Text>
                <Button title="Back" onPress={() => router.back()} />
            </Screen>
        );
    }

    return (
        <Screen>
            <SectionTitle>{product.name}</SectionTitle>

            <View style={{ marginTop: 16, gap: 8 }}>
                <Text>Big unit: {product.bigUnitName}</Text>
                <Text>Small unit: {product.smallUnitName}</Text>
                <Text>Big unit quantity: {product.bigUnitQuantity}</Text>
                <Text>Small unit quantity: {product.smallUnitQuantity}</Text>
                <Text>Price / big unit: {product.bigUnitPrice} EGP</Text>
                <Text>Price / small unit: {product.smallUnitPrice} EGP</Text>
                <Text style={{ fontWeight: "bold" }}>
                    Total price: {product.totalPrice} EGP
                </Text>
            </View>

            <View style={{ marginTop: 24 }}>
                <Button title="Edit (later)" onPress={() => { }} />
            </View>
        </Screen>
    );
}
