import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TxnDataType } from "@/types/types";
import { useTxn } from "@/context/TxnContext";

const NewTransaction = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const [history, setHistory] = useState<TxnDataType[]>([]);
  const { entryData, txnData } = useTxn();
  if (!entryData) return;
  if (!txnData) return;
  const { entry } = entryData;
  const [description, setDescription] = useState(txnData.description);
  const [amount, setAmount] = useState(
    txnData.amount === 0 ? "" : txnData.amount.toString(),
  );
  const [txnType, setTxnType] = useState(txnData.type);
  const [txnDate, setTxnDate] = useState<Date | undefined>(
    new Date(txnData.date),
  );
  const [notes, setNotes] = useState(txnData.notes);
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
  });

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem("transaction_history");
      if (data) {
        let dataObj = JSON.parse(data);
        setHistory(dataObj);
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const saveTransaction = async () => {
    try {
      let curId = 0;
      if (history.length !== 0) {
        let ids: number[] = [];
        history.forEach((line: TxnDataType) => {
          ids.push(line.txnId);
        });

        curId = Math.max(...ids);
      }

      const txnObject = {
        txnId: curId + 1,
        description,
        amount: Number(amount),
        type: txnType,
        date: txnDate,
        notes,
      };

      await AsyncStorage.setItem(
        "transaction_history",
        JSON.stringify([txnObject, ...history]),
      );
    } catch (err) {
      console.error("Storage Error:", err);
    }
  };

  const handleAdd = async () => {
    let valid = true;
    let newErrors = { description: "", amount: "" };
    let amountRegex = /^[0-9]*$/;

    if (!description) {
      newErrors.description = "Please enter a description";
      valid = false;
    }

    if (!amount) {
      newErrors.amount = "Please enter an amount";
      valid = false;
    } else if (!amountRegex.test(amount)) {
      newErrors.amount = "Enter only number";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      await saveTransaction();
      setTimeout(() => router.navigate("/"), 200);
    }
  };

  const handleDelete = async () => {
    let filteredHistory = history.filter(
      (item) => item.txnId !== txnData.txnId,
    );

    try {
      await AsyncStorage.setItem(
        "transaction_history",
        JSON.stringify(filteredHistory),
      );
    } catch (err) {
      console.error("Storage Error:", err);
    }

    router.navigate("/");
  };

  const handleSave = () => {
    console.log("Save button pressed!");
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={entry === "new" ? "New Transaction" : "Edit Transaction"}
        />
      </Appbar.Header>

      <ScrollView>
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
            style={{ height: "55%" }}
          />
        </View>
      </ScrollView>

      {entry === "edit" ? (
        <Surface style={styles.bottomBarEdit}>
          <Button
            mode="contained"
            style={styles.editBtn}
            contentStyle={{ height: 48 }}
            onPress={handleDelete}
            buttonColor={theme.colors.error}
            textColor={theme.colors.background}
          >
            Delete
          </Button>
          <Button
            mode="contained"
            style={styles.editBtn}
            contentStyle={{ height: 48 }}
            onPress={handleSave}
            disabled={!description || !amount}
          >
            Save
          </Button>
        </Surface>
      ) : (
        <Surface style={styles.bottomBarNew}>
          <Button
            mode="contained"
            style={styles.addBtn}
            contentStyle={{ height: 48 }}
            onPress={handleAdd}
            disabled={!description || !amount}
          >
            Add
          </Button>
        </Surface>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },

  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
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

  bottomBarNew: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  addBtn: {
    borderRadius: 8,
    minWidth: 120,
  },

  bottomBarEdit: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  editBtn: {
    borderRadius: 8,
    width: "48%",
  },
});

export default NewTransaction;
