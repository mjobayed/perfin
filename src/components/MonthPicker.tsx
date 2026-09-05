import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme, Portal, Modal } from "react-native-paper";

interface MonthPickerProps {
  value: Date;
  onSelect: (date: Date) => void;
  maxDate?: Date;
}

const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  onSelect,
  maxDate,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [viewYear, setViewYear] = useState(value.getFullYear());

  const label = value.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const openPicker = () => {
    setIsVisible(true);
  };

  const closePicker = () => {
    setIsVisible(false);
  };

  const goToPreviousYear = () => setViewYear((year) => year - 1);
  const goToNextYear = () => setViewYear((year) => year + 1);

  return (
    <>
      <Pressable onPress={openPicker}>
        <View
          style={[
            styles.trigger,
            { backgroundColor: theme.colors.elevation.level2 },
          ]}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {label}
          </Text>
          <IconButton icon="chevron-down" size={18} style={{ margin: 0 }} />
        </View>
      </Pressable>

      <Portal>
        <Modal
          visible={isVisible}
          onDismiss={closePicker}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.elevation.level3 },
          ]}
        >
          <View style={styles.yearRow}>
            <IconButton icon="chevron-left" onPress={goToPreviousYear} />
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onSurface }}
            >
              {viewYear}
            </Text>
            <IconButton icon="chevron-right" onPress={goToNextYear} />
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default MonthPicker;

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 4,
    marginTop: 12,
  },

  modal: {
    marginHorizontal: 32,
    borderRadius: 20,
    padding: 20,
  },

  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
