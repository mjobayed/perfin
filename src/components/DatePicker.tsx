import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { TextInput } from "react-native-paper";
import {
  DatePickerModal,
  enGB,
  registerTranslation,
} from "react-native-paper-dates";
registerTranslation("en-GB", enGB);

interface DateInputProps {
  value: Date | undefined;
  onPick: (date: Date | undefined) => void;
}

const DatePicker: React.FC<DateInputProps> = ({ value, onPick }) => {
  const [isVisible, setIsVisible] = useState(false);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleConfirm = (params: { date: Date | undefined }) => {
    setIsVisible(false);
    onPick(params.date);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const curDate = formatDate(today);

  return (
    <View>
      <Pressable onPress={() => setIsVisible(true)}>
        <View pointerEvents="none">
          <TextInput
            label={"Date"}
            value={formatDate(value) || curDate}
            mode="outlined"
            placeholder="Select Date"
            left={<TextInput.Icon icon={"calendar"} />}
            editable={false}
          />
        </View>
      </Pressable>

      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={isVisible}
        date={value}
        onDismiss={() => setIsVisible(false)}
        onConfirm={handleConfirm}
        validRange={{
          endDate: today,
        }}
      />
    </View>
  );
};

export default DatePicker;
