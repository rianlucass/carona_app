import { TextInput } from "react-native-paper";

export function AppInput(props) {
  return (
    <TextInput
      mode="outlined"
      style={{ marginBottom: 12 }}
      {...props}
    />
  );
}
