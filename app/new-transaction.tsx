import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Appbar,
  Surface,
  TextInput,
  useTheme,
  HelperText,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DatePicker from "@/components/DatePicker";

const NewTransaction = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [txnType, setTxnType] = useState("income");
  const [txnDate, setTxnDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
  });

  const handleAdd = () => {
    console.log("Add button pressed");
    let valid = true;
    let newErrors = { description: "", amount: "" };

    if (!description) {
      newErrors.description = "Please enter a description";
      valid = false;
    }

    if (!amount) {
      newErrors.amount = "Please enter an amount";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const txnObject = {
        txnId: 1,
        description,
        amount,
        type: txnType,
        date: txnDate,
        notes,
      };

      console.log(txnObject);
    }
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="New Transaction" />
      </Appbar.Header>

      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label={"Description"}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (text) setErrors((prev) => ({ ...prev, description: "" }));
          }}
          error={!!errors.description}
        />
        {errors.description && (
          <HelperText type="error" visible={!!errors.description}>
            {errors.description}
          </HelperText>
        )}

        <View style={styles.amountContainer}>
          <TextInput
            mode="outlined"
            label={"Amount"}
            value={amount}
            keyboardType="number-pad"
            onChangeText={(text) => {
              setAmount(text.trim());
              if (text) setErrors((prev) => ({ ...prev, amount: "" }));
            }}
            style={{ flex: 1 }}
            error={!!errors.amount}
          />

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
        {errors.amount && (
          <HelperText type="error" visible={!!errors.amount}>
            {errors.amount}
          </HelperText>
        )}
        <DatePicker value={txnDate} onPick={(date) => setTxnDate(date)} />

        <TextInput
          mode="outlined"
          label={"Notes"}
          multiline={true}
          numberOfLines={100}
          value={notes}
          onChangeText={(text) => setNotes(text)}
          style={{ height: "50%" }}
        />
      </View>

      <Surface style={styles.bottomBar}>
        <Button
          mode="contained"
          style={styles.addBtn}
          contentStyle={{ height: 48 }}
          onPress={handleAdd}
        >
          Add
        </Button>
      </Surface>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },

  container: {
    paddingHorizontal: 16,
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

  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 30,
  },

  addBtn: {
    borderRadius: 8,
    minWidth: 120,
  },
});

export default NewTransaction;
