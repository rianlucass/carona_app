import { Button } from "react-native-paper";

export function AppButton({ children, ...props }) {
  return (
    <Button mode="contained" {...props}>
      {children}
    </Button>
  );
}
