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
  Portal,
  Dialog,
  Text,
  SegmentedButtons,
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
  const [dialogVisible, setDialogVisible] = useState(false);

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

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
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

    hideDialog();
    router.navigate("/");
  };

  const handleSave = async () => {
    let editedHistory = history.map((item) => {
      if (item.txnId === txnData.txnId) {
        return {
          txnId: txnData.txnId,
          description,
          amount: Number(amount),
          type: txnType,
          date: txnDate,
          notes,
        };
      }
      return item;
    });

    try {
      await AsyncStorage.setItem(
        "transaction_history",
        JSON.stringify(editedHistory),
      );
    } catch (err) {
      console.error("Storage Error:", err);
    }

    router.navigate("/");
  };

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={entry === "new" ? "New Transaction" : "Edit Transaction"}
        />
      </Appbar.Header>

      <ScrollView>
        <View style={styles.container}>
          <SegmentedButtons
            value={txnType}
            onValueChange={(value) => setTxnType(value as "income" | "expense")}
            style={{ marginBottom: 20 }}
            buttons={[
              {
                value: "income",
                label: "Income",
                icon: "arrow-top-right",
                checkedColor: theme.colors.primary,
              },
              {
                value: "expense",
                label: "Expense",
                icon: "arrow-bottom-right",
                checkedColor: theme.colors.error,
              },
            ]}
          />
          <TextInput
            mode="outlined"
            label={"Description"}
            value={description}
            left={<TextInput.Icon icon="text" />}
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
              left={<TextInput.Icon icon="currency-bdt" />}
              keyboardType="number-pad"
              onChangeText={(text) => {
                setAmount(text.trim());
                if (text) setErrors((prev) => ({ ...prev, amount: "" }));
              }}
              style={{ flex: 1 }}
              error={!!errors.amount}
            />
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
            left={<TextInput.Icon icon="note-text-outline" />}
            onChangeText={(text) => setNotes(text)}
            style={{ minHeight: 200 }}
          />
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Text variant="bodyLarge">Delete this transaction?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleDelete} textColor={theme.colors.error}>
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {entry === "edit" ? (
        <Surface style={styles.bottomBarEdit}>
          <Button
            mode="contained"
            style={styles.editBtn}
            contentStyle={{ height: 48 }}
            onPress={showDialog}
            buttonColor={theme.colors.error}
            textColor={theme.colors.background}
            icon="delete-outline"
          >
            Delete
          </Button>
          <Button
            mode="contained"
            style={styles.editBtn}
            contentStyle={{ height: 48 }}
            onPress={handleSave}
            disabled={!description || !amount}
            icon="check"
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
            icon="plus"
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
    gap: 4,
  },

  amountContainer: {
    flexDirection: "row",
    gap: 8,
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
