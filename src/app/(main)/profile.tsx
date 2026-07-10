import { StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.content, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.emptyState}>
          <SymbolView name="person.circle" size={48} tintColor="#D8D8D8" weight="thin" />
          <Text style={styles.emptyTitle}>No profile yet</Text>
          <Text style={styles.emptyDesc}>
            Your profile and preferences will appear here
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
    ...TypeScale.headingMd,
    color: "#1A1A1A",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTitle: {
    ...TypeScale.sectionLg,
    color: "#888888",
  },
  emptyDesc: {
    ...TypeScale.muted,
    color: "#B0B0B0",
    textAlign: "center",
  },
});
