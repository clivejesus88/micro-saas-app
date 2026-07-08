import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MAX_WIDTH = 430;
const CONTAINER_WIDTH = Math.min(SCREEN_WIDTH, MAX_WIDTH);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#1C2A0E", "#2D4A1A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1.2 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.greetingRow}>
              <SymbolView name="sparkles" size={16} tintColor="#A8D68A" weight="semibold" />
              <Text style={styles.greeting}>Welcome to Fringe</Text>
            </View>

            <Text style={styles.heroTitle}>
              Stop Overpaying{"\n"}for Anything
            </Text>

            <View style={styles.savingsBadge}>
              <SymbolView name="leaf.fill" size={14} tintColor="#A8D68A" />
              <Text style={styles.savingsText}>You've saved $0 so far</Text>
            </View>

            <Pressable
              style={styles.quickScanButton}
              onPress={() => Alert.alert("Scanner", "Camera scanner coming soon")}
            >
              <SymbolView name="camera.viewfinder" size={18} tintColor="#1C2A0E" weight="semibold" />
              <Text style={styles.quickScanText}>Scan a Product</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.bodySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.actionGrid}>
            <Pressable
              style={styles.actionCard}
              onPress={() => Alert.alert("Scanner", "Camera scanner coming soon")}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#F0F7EB" }]}>
                <SymbolView name="camera.viewfinder" size={22} tintColor="#1C2A0E" weight="semibold" />
              </View>
              <Text style={styles.actionLabel}>Scan Price</Text>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => router.push("/history")}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#FFF4E8" }]}>
                <SymbolView name="clock" size={22} tintColor="#FF6B1A" weight="semibold" />
              </View>
              <Text style={styles.actionLabel}>History</Text>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => router.push("/vault")}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#EEF2F9" }]}>
                <SymbolView name="shield" size={22} tintColor="#3B6CB7" weight="semibold" />
              </View>
              <Text style={styles.actionLabel}>Savings Vault</Text>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => router.push("/profile")}
            >
              <View style={[styles.actionIconBox, { backgroundColor: "#F5F0FF" }]}>
                <SymbolView name="person" size={22} tintColor="#7C4DFF" weight="semibold" />
              </View>
              <Text style={styles.actionLabel}>Profile</Text>
            </Pressable>
          </View>

          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <View style={styles.emptyState}>
              <SymbolView name="doc.text.magnifyingglass" size={40} tintColor="#D8D8D8" weight="thin" />
              <Text style={styles.emptyTitle}>No scans yet</Text>
              <Text style={styles.emptyDesc}>
                Scan your first product to start saving
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_WIDTH,
  },
  scrollContent: {
    alignItems: "center",
  },
  heroSection: {
    width: CONTAINER_WIDTH - 32,
    borderRadius: 24,
    overflow: "hidden",
  },
  heroContent: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "500",
    color: "#A8D68A",
    letterSpacing: 0.3,
  },
  heroTitle: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 31,
    letterSpacing: -1.2,
    textAlign: "center",
    color: "#FFFFFF",
  },
  savingsBadge: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  savingsText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#D4E8C4",
    letterSpacing: 0.2,
  },
  quickScanButton: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
  },
  quickScanText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C2A0E",
    letterSpacing: -0.15,
  },
  bodySection: {
    width: CONTAINER_WIDTH - 32,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: -0.4,
  },
  actionGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: -0.1,
  },
  recentSection: {
    marginTop: 32,
  },
  emptyState: {
    marginTop: 24,
    alignItems: "center",
    gap: 8,
    paddingVertical: 32,
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888888",
    letterSpacing: -0.2,
  },
  emptyDesc: {
    fontSize: 13,
    fontWeight: "400",
    color: "#B0B0B0",
    letterSpacing: -0.1,
    textAlign: "center",
    maxWidth: 200,
  },
});
