import InventoryListItem from "@/components/products/items/inventoryListItem";
import ItemsListScreenLayout from "@/components/products/layout/itemsListScreenLayout";
import { getInventoryWithBreakdown } from "@/services/inventoryService";
import { useFocusReloadList } from "../../../../hooks/useFocusReloadList";

export default function InventoryScreen() {
    const { items, loading } = useFocusReloadList(getInventoryWithBreakdown);

    return (
        <ItemsListScreenLayout
            title="Inventory Items"
            items={items}
            loading={loading}
            keyExtractor={(i) => String(i.id)}
            ItemComponent={InventoryListItem}
            emptyText="لا يوجد أصناف في المخزون حالياً."
            newItemHref="/(mainTabs)/products/inventory/new"
        />
    );
}
