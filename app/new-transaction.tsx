import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Appbar, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NewTransaction = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="New Transaction" />
      </Appbar.Header>
      <Text>Hello World!</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  rootSurface: { flex: 1 },
});

export default NewTransaction;
