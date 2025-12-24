import { StatusBar } from "expo-status-bar";
import Welcome from "./welcome/welcome";

export default function index() {

  return (
    <>
    <StatusBar style="auto" />
      <Welcome />
    </>
  );
}
