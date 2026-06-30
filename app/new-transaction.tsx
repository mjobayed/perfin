import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NewTransaction = () => {
  const insets = useSafeAreaInsets();

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Text>Hello World!</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },
});

export default NewTransaction;
