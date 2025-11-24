import MenuListItem from "@/components/products/items/menuListItem";
import ItemsListScreenLayout from "@/components/products/layout/itemsListScreenLayout";
import { getMenuListWithCost } from "@/services/menuService";
import { useFocusReloadList } from "../../../../hooks/useFocusReloadList";

export default function MenuItemsScreen() {
  const { items, loading } = useFocusReloadList(() =>
    getMenuListWithCost({ onlyActive: false })
  );

  return (
    <ItemsListScreenLayout
      title="Menu Items"
      items={items}
      loading={loading}
      keyExtractor={(i) => String(i.menuItem.id)}
      ItemComponent={MenuListItem}
      emptyText="لا يوجد منتجات حالياً."
      newItemHref="/(mainTabs)/products/menuItems/new"
    />
  );
}
