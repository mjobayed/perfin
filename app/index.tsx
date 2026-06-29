import { StyleSheet } from "react-native";
import { Appbar, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.Content title="Transactions" />
      </Appbar.Header>

      <Text>Edit app/index.tsx to edit this screen.</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },
});
