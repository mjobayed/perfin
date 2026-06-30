import { useState } from "react";
import { StyleSheet } from "react-native";
import { AnimatedFAB, Appbar, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  const [isExtended, setIsExtended] = useState(true);

  return (
    <Surface style={[styles.rootSurface, { paddingBottom: insets.bottom }]}>
      <Appbar.Header>
        <Appbar.Content title="Transactions" />
      </Appbar.Header>

      <Text>Edit app/index.tsx to edit this screen.</Text>
      <AnimatedFAB
        icon={"plus"}
        label={"New Transaction"}
        extended={isExtended}
        onPress={() => console.log("pressed")}
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
});
