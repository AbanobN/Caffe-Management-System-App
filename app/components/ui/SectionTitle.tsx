import { ReactNode } from "react";
import { Text } from "react-native";

type Props = {
    children: ReactNode;
};

export default function SectionTitle({ children }: Props) {
    return (
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {children}
        </Text>
    );
}
