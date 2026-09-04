import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from "react-native";
import {
  AnimatedFAB,
  Appbar,
  Avatar,
  Card,
  Icon,
  Searchbar,
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
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      date: new Date().toString(),
      notes: "",
    });
    setEntryData({ entry: "new" });
    router.navigate("/transaction");
  };

  const handleCardPress = (item: TxnDataType) => {
    setTxnData({
      txnId: item.txnId,
      description: item.description,
      amount: item.amount,
      type: item.type,
      date: item.date,
      notes: item.notes,
    });
    setEntryData({ entry: "edit" });
    router.navigate("/transaction");
  };

  const onListScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const openSearch = () => {
    setIsSearching(true);
  };

  const closeSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return history;

    return history.filter(
      (item) =>
        item.description.toLowerCase().includes(query) ||
        item.notes.toLowerCase().includes(query),
    );
  }, [history, searchQuery]);

  const renderTxnItem = ({ item }: { item: TxnDataType }) => {
    const isIncome = item.type === "income";
    return (
      <Pressable onPress={() => handleCardPress(item)}>
        <Card
          mode="contained"
          style={[
            styles.txnCard,
            { backgroundColor: theme.colors.elevation.level2 },
          ]}
        >
          <Card.Content style={styles.cardContent}>
            <View style={styles.txnLeft}>
              <Avatar.Icon
                size={40}
                icon={isIncome ? "arrow-top-right" : "arrow-bottom-right"}
                color={isIncome ? theme.colors.primary : theme.colors.error}
                style={{
                  backgroundColor: isIncome
                    ? theme.colors.primaryContainer
                    : theme.colors.errorContainer,
                }}
              />
              <View style={{ flexShrink: 1 }}>
                <Text variant="titleMedium">{item.description}</Text>
                <Text variant="bodySmall" style={styles.itemDate}>
                  {formatDate(item.date)}
                </Text>
              </View>
            </View>
            <Text
              variant="titleLarge"
              style={{
                color: isIncome ? theme.colors.primary : theme.colors.error,
                fontWeight: "bold",
              }}
            >
              {isIncome ? "+" + item.amount : "-" + item.amount}
            </Text>
          </Card.Content>
        </Card>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon
        source="tray-arrow-down"
        size={48}
        color={theme.colors.onSurfaceVariant}
      />
      <Text
        variant="titleMedium"
        style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}
      >
        No transactions yet
      </Text>
      <Text
        variant="bodyMedium"
        style={{
          color: theme.colors.onSurfaceVariant,
          marginTop: 4,
          textAlign: "center",
        }}
      >
        Tap "New Transaction" to add your first income or expense.
      </Text>
    </View>
  );

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header elevated>
        {isSearching ? (
          <Searchbar
            placeholder="Search Transactions"
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="arrow-left"
            onIconPress={closeSearch}
            autoFocus
          />
        ) : (
          <>
            <Appbar.Content style={{ marginLeft: 10 }} title="Home" />
            <Appbar.Action icon="magnify" onPress={openSearch} />
          </>
        )}
      </Appbar.Header>

      {!isSearching && (
        <Surface
          mode="flat"
          style={[
            styles.summaryCard,
            { backgroundColor: theme.colors.elevation.level2 },
          ]}
        >
          <Text
            variant="labelLarge"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Total Balance
          </Text>
          <Text
            variant="displaySmall"
            style={{ fontWeight: "700", color: theme.colors.onSurface }}
          >
            {total.balance}
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Icon
                source="arrow-up-bold-circle"
                size={20}
                color={theme.colors.primary}
              />
              <View>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Income
                </Text>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary, fontWeight: "600" }}
                >
                  {total.income}
                </Text>
              </View>
            </View>

            <View style={styles.summaryPill}>
              <Icon
                source="arrow-down-bold-circle"
                size={20}
                color={theme.colors.error}
              />
              <View>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Expense
                </Text>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.error, fontWeight: "600" }}
                >
                  {total.expense}
                </Text>
              </View>
            </View>
          </View>
        </Surface>
      )}

      <Text
        variant="titleSmall"
        style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}
      >
        {isSearching ? "Search Results" : "Recent Transactions"}
      </Text>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.txnId.toString()}
        renderItem={renderTxnItem}
        contentContainerStyle={[
          styles.listContainer,
          filteredHistory.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
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

  sectionLabel: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },

  summaryCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 20,
    borderRadius: 20,
    gap: 4,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  summaryPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(127,  127, 127, 0.08)",
  },

  txnCard: {
    marginBottom: 16,
    borderRadius: 16,
  },

  txnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },

  listContainer: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 110,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  listContentEmpty: { flexGrow: 1 },
});
