import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import ProductCard from "../../../components/products/ProductCard";
import Screen from "../../../components/ui/Screen";
import SectionTitle from "../../../components/ui/SectionTitle";
import type { Product } from "../../../models/product";
import { getProducts } from "../../../services/api";

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
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
        <SectionTitle>Products</SectionTitle>
        <Text></Text> 
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link
            href={`/(mainTabs)/products/${item.id}`}
            asChild
          >
            <TouchableOpacity>
              <ProductCard product={item} />
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <Text>No products yet. Using seed data only.</Text>
        }
      />
    </Screen>
  );
}
