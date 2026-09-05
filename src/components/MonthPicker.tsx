import React from "react";
import { Text } from "react-native-paper";

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
  return <Text>Hello from MonthPicker</Text>;
};

export default MonthPicker;
