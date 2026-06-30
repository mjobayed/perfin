import { Pressable, View } from "react-native";
import { TextInput } from "react-native-paper";

const DatePicker = () => {
  return (
    <View>
      <Pressable>
        <View>
          <TextInput
            label={"Date"}
            mode="outlined"
            placeholder="Select Date"
            left={<TextInput.Icon icon={"calendar"} />}
            editable={false}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default DatePicker;
