import { useState } from "react";
import { Pressable, View } from "react-native";
import { TextInput } from "react-native-paper";
import {
  DatePickerModal,
  enGB,
  registerTranslation,
} from "react-native-paper-dates";
registerTranslation("en-GB", enGB);

const DatePicker = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [value, setValue] = useState<Date | undefined>(undefined);

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
    setValue(params.date);
  };

  return (
    <View>
      <Pressable onPress={() => setIsVisible(true)}>
        <View>
          <TextInput
            label={"Date"}
            value={formatDate(value)}
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
      />
    </View>
  );
};

export default DatePicker;
