import { Text, View } from "react-native";
import type { Product } from "../../../models/product";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    return (
        <View
            style={{
                padding: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderRadius: 8,
            }}
        >
            <Text style={{ fontWeight: "bold" }}>{product.name}</Text>
            <Text>Total quantity: {product.totalQuantity}</Text>
            <Text>Small unit price: {product.smallUnitPrice} EGP</Text>
        </View>
    );
}
