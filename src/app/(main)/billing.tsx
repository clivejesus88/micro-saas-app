import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  CreditCard,
  Crown,
  Receipt,
  ChevronRight,
  Plus,
} from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

export default function BillingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useScrollContext();

  const bottomSpacer = BOTTOM_NAV_HEIGHT + insets.bottom + 20;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomSpacer },
        ]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.headerTitle}>Billing</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Current Plan */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={styles.planIconWrap}>
              <Crown size={24} color="#FF6B1A" strokeWidth={2} />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Fringe Pro</Text>
              <Text style={styles.planStatus}>Active · Renews Dec 15, 2026</Text>
            </View>
          </View>
          <View style={styles.planDivider} />
          <View style={styles.planPriceRow}>
            <Text style={styles.planPrice}>$59.99</Text>
            <Text style={styles.planPeriod}>/year</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <CreditCard size={22} color="#4A7A28" strokeWidth={2} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Visa ending in 4242</Text>
                <Text style={styles.menuSubtext}>Expires 08/2027</Text>
              </View>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            </View>
            <Pressable style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <Plus size={22} color="#888888" strokeWidth={2} />
              </View>
              <Text style={styles.menuLabel}>Add Payment Method</Text>
              <ChevronRight size={20} color="#C4C4C4" strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* Billing History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BILLING HISTORY</Text>
          <View style={styles.menuCard}>
            {[
              { date: "Nov 15, 2025", amount: "$59.99", status: "Paid" },
              { date: "Nov 15, 2024", amount: "$59.99", status: "Paid" },
            ].map((item, index, arr) => (
              <Pressable
                key={item.date}
                style={[styles.historyRow, index < arr.length - 1 && styles.menuRowBorder]}
              >
                <View style={styles.menuIcon}>
                  <Receipt size={22} color="#888888" strokeWidth={2} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>{item.date}</Text>
                  <Text style={styles.menuSubtext}>Annual subscription</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>{item.amount}</Text>
                  <Text style={styles.historyStatus}>{item.status}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: -0.4,
    color: "#1A1A1A",
  },

  // Plan Card
  planCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    backgroundColor: "#1C2A0E",
    padding: 20,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  planIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: -0.36,
    color: "#FFFFFF",
  },
  planStatus: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  planDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginTop: 16,
  },
  planPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 14,
  },
  planPrice: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: -0.84,
    color: "#FFFFFF",
  },
  planPeriod: {
    ...TypeScale.captionLg,
    fontWeight: "400",
    color: "rgba(255,255,255,0.5)",
  },

  // Sections
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...TypeScale.captionLg,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#888888",
    marginBottom: 12,
  },
  menuCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 3,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIcon: {
    width: 36,
    alignItems: "center",
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    ...TypeScale.bodyLg,
    color: "#1A1A1A",
  },
  menuSubtext: {
    ...TypeScale.captionSm,
    fontWeight: "400",
    color: "#AAAAAA",
    marginTop: 1,
  },
  defaultBadge: {
    backgroundColor: "#F0F6E8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    ...TypeScale.captionSm,
    fontWeight: "600",
    color: "#4A7A28",
  },

  // History
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 16,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyAmount: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  historyStatus: {
    ...TypeScale.captionSm,
    fontWeight: "400",
    color: "#4A7A28",
    marginTop: 2,
  },
});
