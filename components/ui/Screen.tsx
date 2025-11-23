import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
    children: ReactNode;
};

export default function Screen({ children }: Props) {
    return (
        <View style={styles.container}>{children}</View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
});
