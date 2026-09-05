import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

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

  const label = value.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  return (
    <>
      <Pressable>
        <View
          style={[
            styles.trigger,
            { backgroundColor: theme.colors.elevation.level2 },
          ]}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {label}
          </Text>
          <IconButton icon="chevron-down" size={18} />
        </View>
      </Pressable>
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
});
