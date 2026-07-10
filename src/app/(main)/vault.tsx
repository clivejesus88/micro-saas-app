import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "@/hooks/use-responsive";
import { MAX_WIDTH } from "@/constants/layout";

export default function VaultScreen() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useResponsive();

  return (
    <View style={styles.root}>
      <View style={[styles.content, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.title, { fontSize: fontScale(28) }]}>
          Savings Vault
        </Text>
        <View style={styles.emptyState}>
          <SymbolView name="shield" size={48} tintColor="#D8D8D8" weight="thin" />
          <Text style={[styles.emptyTitle, { fontSize: fontScale(18) }]}>
            Vault is empty
          </Text>
          <Text style={styles.emptyDesc}>
            Your savings and protected deals will appear here
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_WIDTH,
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -1.2,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTitle: {
    fontWeight: "600",
    color: "#888888",
    letterSpacing: -0.3,
  },
  emptyDesc: {
    fontSize: 14,
    fontWeight: "400",
    color: "#B0B0B0",
    letterSpacing: -0.1,
    textAlign: "center",
  },
});
