import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import Screen from "../../../components/ui/Screen";
import SectionTitle from "../../../components/ui/SectionTitle";
import { createShift } from "../../../services/api";

export default function NewShiftScreen() {
    const router = useRouter();
    const [workerName, setWorkerName] = useState("");
    const [cash, setCash] = useState("");

    const handleSave = async () => {
        await createShift({
            workerName,
            cash: Number(cash) || 0,
        });

        router.back();
    };

    return (
        <Screen>
            <SectionTitle>Open New Shift</SectionTitle>

            <View style={{ marginTop: 16, gap: 16 }}>
                <View>
                    <Text>Worker name</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 8,
                            marginTop: 8,
                        }}
                        value={workerName}
                        onChangeText={setWorkerName}
                    />
                </View>

                <View>
                    <Text>Start cash</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 8,
                            marginTop: 8,
                        }}
                        keyboardType="numeric"
                        value={cash}
                        onChangeText={setCash}
                    />
                </View>

                <Button title="Save" onPress={handleSave} />
            </View>
        </Screen>
    );
}
