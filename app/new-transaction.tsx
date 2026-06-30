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

  const handleIncomeBtn = () => {
    console.log("Income button pressed");
  };

  const handleExpenseBtn = () => {
    console.log("Expense button pressed");
  };

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

          <View style={{ paddingTop: 4, paddingBottom: 4 }}>
            <Button
              mode="contained"
              onPress={handleIncomeBtn}
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
              onPress={handleExpenseBtn}
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
              buttonColor={theme.colors.error}
              textColor={theme.colors.background}
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
