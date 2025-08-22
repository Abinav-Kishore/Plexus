import { useColorScheme } from "react-native";

export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === "dark"
    ? {
        background: "#181818",
        text: "#fff",
        inputBg: "#222",
        inputBorder: "#444",
        button: "#333",
      }
    : {
        background: "#fff",
        text: "#181818",
        inputBg: "#f5f5f5",
        inputBorder: "#ccc",
        button: "#eee",
      };
}
