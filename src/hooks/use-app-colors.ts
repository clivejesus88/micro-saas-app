import { useColorScheme } from "react-native";
import { AppColors } from "@/constants/theme";

export function useAppColors() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return { colors: isDark ? AppColors.dark : AppColors.light, isDark };
}
