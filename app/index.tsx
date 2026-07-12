import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  AnimatedFAB,
  Appbar,
  Card,
  Divider,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TotalDataType, TxnDataType } from "@/types/types";
import { useTxn } from "@/context/TxnContext";

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const [isExtended, setIsExtended] = useState(true);
  const [history, setHistory] = useState<TxnDataType[]>([]);
  const [total, setTotal] = useState<TotalDataType>({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const { setEntryData, setTxnData } = useTxn();

  const calculateTotal = (data: TxnDataType[]) => {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach((item) => {
      if (item.type === "income") totalIncome += item.amount;
      if (item.type === "expense") totalExpense += item.amount;
    });

    totalBalance = totalIncome - totalExpense;

    setTotal({
      balance: totalBalance,
      income: totalIncome,
      expense: totalExpense,
    });
  };

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem("transaction_history");
      if (data) {
        let dataObj = JSON.parse(data);
        setHistory(dataObj);
        calculateTotal(dataObj);
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

  const formatDate = (date: string) => {
    let dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleNewTransaction = () => {
    setTxnData({
      txnId: 0,
      description: "",
      amount: 0,
      type: "income",
      date: "",
      notes: "",
    });
    setEntryData({ entry: "new" });
    router.navigate("/transaction");
  };

  const onListScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const renderTxnItem = ({ item }: { item: TxnDataType }) => (
    <Card mode="outlined" style={{ marginBottom: 16 }}>
      <Card.Content style={styles.cardContent}>
        <View>
          <Text variant="titleMedium">{item.description}</Text>
          <Text variant="bodySmall" style={styles.itemDate}>
            {formatDate(item.date)}
          </Text>
        </View>

        <View>
          <Text
            variant="titleLarge"
            style={{
              color:
                item.type === "income"
                  ? theme.colors.primary
                  : theme.colors.error,
              fontWeight: "bold",
            }}
          >
            {item.type === "income" ? "+" + item.amount : "-" + item.amount}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
      </Appbar.Header>

      <View style={styles.totalAmountContainer}>
        <View>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", color: theme.colors.secondary }}
          >
            Balance: {total.balance}
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: theme.colors.primary }}>
            Income: {total.income}
          </Text>
          <Text style={{ color: theme.colors.error }}>
            Expense: {total.expense}
          </Text>
        </View>
      </View>

      <Divider
        style={{ backgroundColor: theme.colors.error, marginHorizontal: 12 }}
      />

      <FlatList
        data={history}
        keyExtractor={(item) => item.txnId.toString()}
        renderItem={renderTxnItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        onScroll={onListScroll}
      />

      <AnimatedFAB
        icon={"plus"}
        label={"New Transaction"}
        extended={isExtended}
        onPress={handleNewTransaction}
        animateFrom={"right"}
        iconMode={"dynamic"}
        style={styles.fabStyle}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },

  fabStyle: {
    bottom: 100,
    right: 16,
    position: "absolute",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemDate: {
    opacity: 0.6,
    marginTop: 2,
  },

  totalAmountContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
