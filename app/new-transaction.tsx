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
import DatePicker from "@/components/DatePicker";

const NewTransaction = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const [txnType, setTxnType] = useState("income");
  const [txnDate, setTxnDate] = useState<Date | undefined>(undefined);

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="New Transaction" />
      </Appbar.Header>

      <View style={styles.container}>
        <TextInput mode="outlined" label={"Description"} />

        <View style={styles.amountContainer}>
          <TextInput mode="outlined" label={"Amount"} style={{ flex: 1 }} />

          <View style={styles.txnBtnContainer}>
            <Button
              mode={txnType === "income" ? "contained" : "outlined"}
              onPress={() => setTxnType("income")}
              style={styles.incomeBtn}
            >
              Income
            </Button>
            <Button
              mode="outlined"
              onPress={() => setTxnType("expense")}
              style={styles.expenseBtn}
              buttonColor={txnType === "expense" ? theme.colors.error : ""}
              textColor={txnType === "expense" ? theme.colors.background : ""}
            >
              Expense
            </Button>
          </View>
        </View>
        <DatePicker value={txnDate} onPick={(date) => setTxnDate(date)} />

        <TextInput
          mode="outlined"
          label={"Notes"}
          multiline={true}
          numberOfLines={100}
          style={{ height: "50%" }}
        />
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

  amountContainer: {
    flexDirection: "row",
    gap: 8,
  },

  txnBtnContainer: {
    marginTop: 4,
    marginBottom: 4,
  },

  incomeBtn: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  expenseBtn: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default NewTransaction;
