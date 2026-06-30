import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Appbar,
  Surface,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NewTransaction = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const [txnType, setTxnType] = useState("income");

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="New Transaction" />
      </Appbar.Header>

      <View style={styles.container}>
        <TextInput mode="outlined" label={"Description"} />

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput mode="outlined" label={"Amount"} style={{ flex: 1 }} />

          <View style={{ marginTop: 4, marginBottom: 4 }}>
            <Button
              mode={txnType === "income" ? "contained" : "outlined"}
              onPress={() => setTxnType("income")}
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              Income
            </Button>
            <Button
              mode="outlined"
              onPress={() => setTxnType("expense")}
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
              buttonColor={txnType === "expense" ? theme.colors.error : ""}
              textColor={txnType === "expense" ? theme.colors.background : ""}
            >
              Expense
            </Button>
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },

  container: {
    padding: 16,
    gap: 8,
  },
});

export default NewTransaction;
