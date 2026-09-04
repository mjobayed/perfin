import { TxnProvider } from "@/context/TxnContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <TxnProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="transaction" options={{ headerShown: false }} />
        </Stack>
      </TxnProvider>
    </PaperProvider>
  );
}
