import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.content, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>History</Text>
        <View style={styles.emptyState}>
          <SymbolView name="clock" size={48} tintColor="#D8D8D8" weight="thin" />
          <Text style={styles.emptyTitle}>No scan history</Text>
          <Text style={styles.emptyDesc}>
            Your scanned products will appear here
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
    maxWidth: 430,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
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
    fontSize: 18,
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
