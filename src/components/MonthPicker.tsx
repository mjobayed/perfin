import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme, Portal, Modal } from "react-native-paper";

interface MonthPickerProps {
  value: Date;
  onSelect: (date: Date) => void;
  maxDate?: Date;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

  const isMonthDisabled = (monthIndex: number) => {
    if (!maxDate) return false;

    const candidate = new Date(viewYear, monthIndex, 1);
    const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    return candidate > maxMonth;
  };

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

          <View style={styles.grid}>
            {MONTH_LABELS.map((monthLabel, index) => {
              const isSelected =
                value.getFullYear() === viewYear && value.getMonth() === index;
              const isDisabled = isMonthDisabled(index);

              return (
                <Pressable
                  key={monthLabel}
                  disabled={isDisabled}
                  style={[
                    styles.monthCell,
                    isSelected && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                >
                  <Text
                    variant="bodyLarge"
                    style={{
                      color: isDisabled
                        ? theme.colors.onSurfaceDisabled
                        : isSelected
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurface,
                    }}
                  >
                    {monthLabel}
                  </Text>
                </Pressable>
              );
            })}
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  monthCell: {
    width: "30%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 8,
  },
});
