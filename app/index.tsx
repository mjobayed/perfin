import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { AnimatedFAB, Appbar, Card, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TxnData } from "@/types/types";

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isExtended, setIsExtended] = useState(true);
  const [history, setHistory] = useState<TxnData[]>([]);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem("transaction_history");
      if (data) {
        setHistory(JSON.parse(data));
      }
      console.log(history);
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const renderTxnItem = ({ item }: { item: TxnData }) => (
    <Card mode="outlined" style={{ marginBottom: 16 }}>
      <Card.Content style={styles.cardContent}>
        <View>
          <Text variant="titleMedium">{item.description}</Text>
          <Text variant="bodySmall" style={styles.itemDate}>
            {item.date}
          </Text>
        </View>

        <View>
          <Text variant="titleLarge">
            {item.type === "income" ? "+" + item.amount : "-" + item.amount}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.Content title="Transactions" />
      </Appbar.Header>

      <FlatList
        data={history}
        keyExtractor={(item) => item.txnId.toString()}
        renderItem={renderTxnItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <AnimatedFAB
        icon={"plus"}
        label={"New Transaction"}
        extended={isExtended}
        onPress={() => router.navigate("/new-transaction")}
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
});
