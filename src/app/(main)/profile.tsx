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
  Bell,
  Bookmark,
  ChevronRight,
  Clock,
  CreditCard,
  Crown,
  Info,
  Settings,
  Star,
  UserRound,
} from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

interface MenuRow {
  id: string;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  badge?: string;
}

const ACCOUNT_ROWS: MenuRow[] = [
  { id: "edit-profile", label: "Edit Profile", icon: UserRound, iconColor: "#4A7A28" },
  { id: "notifications", label: "Notifications", icon: Bell, iconColor: "#4A7A28", badge: "3" },
  { id: "saved-items", label: "Saved Items", icon: Bookmark, iconColor: "#4A7A28" },
  { id: "scan-history", label: "Scan History", icon: Clock, iconColor: "#4A7A28" },
];

const SUBSCRIPTION_ROWS: MenuRow[] = [
  { id: "pro", label: "Fringe Pro", icon: Crown, iconColor: "#FF6B1A", badge: "Active" },
  { id: "billing", label: "Manage Billing", icon: CreditCard, iconColor: "#888888" },
];

const SUPPORT_ROWS: MenuRow[] = [
  { id: "help", label: "Help Center", icon: Info, iconColor: "#888888" },
  { id: "rate", label: "Rate Fringe", icon: Star, iconColor: "#FF6B1A" },
];

export default function ProfileScreen() {
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
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable style={styles.settingsButton} hitSlop={8}>
            <Settings size={22} color="#1A1A1A" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AR</Text>
              <View style={styles.statusDot} />
            </View>
          </View>

          <Text style={styles.profileName}>Alex Rivera</Text>
          <Text style={styles.profileEmail}>alex@email.com</Text>

          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO Member</Text>
          </View>

          <View style={styles.statsDivider} />
          <View style={styles.statsGrid}>
            <View style={styles.statCell}>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Scans</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: "#4A7A28" }]}>$3,240</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: "#FF6B1A" }]}>12</Text>
              <Text style={styles.statLabel}>Alerts</Text>
            </View>
          </View>
        </View>

        {/* Account */}
        <MenuSection title="ACCOUNT" rows={ACCOUNT_ROWS} lastRowHasBorder={false} />

        {/* Subscription */}
        <MenuSection title="SUBSCRIPTION" rows={SUBSCRIPTION_ROWS} lastRowHasBorder={false} />

        {/* Support */}
        <MenuSection title="SUPPORT" rows={SUPPORT_ROWS} lastRowHasBorder={false} />

        {/* Sign Out */}
        <View style={styles.signOutWrapper}>
          <Pressable style={styles.signOutButton} onPress={() => router.replace("/login")}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function MenuSection({
  title,
  rows,
}: {
  title: string;
  rows: MenuRow[];
  lastRowHasBorder: boolean;
}) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <View style={styles.menuCard}>
        {rows.map((row, index) => {
          const Icon = row.icon;
          const isLast = index === rows.length - 1;
          return (
            <Pressable
              key={row.id}
              style={[styles.menuRow, !isLast && styles.menuRowBorder]}
            >
              <View style={styles.menuIcon}>
                <Icon size={22} color={row.iconColor} strokeWidth={2} />
              </View>
              <Text style={styles.menuLabel}>{row.label}</Text>
              {row.badge && row.badge !== "Active" && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{row.badge}</Text>
                </View>
              )}
              {row.badge === "Active" && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>{row.badge}</Text>
                </View>
              )}
              <ChevronRight size={20} color="#C4C4C4" strokeWidth={2} />
            </Pressable>
          );
        })}
      </View>
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: -0.78,
    color: "#1A1A1A",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Profile Card
  profileCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.1,
    shadowRadius: 70,
    elevation: 6,
  },
  avatarWrapper: {
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2D4A1E",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 4,
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },
  statusDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B1A",
  },
  profileName: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.4,
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 12,
  },
  profileEmail: {
    ...TypeScale.captionLg,
    fontWeight: "400",
    color: "#888888",
    textAlign: "center",
    marginTop: 4,
  },
  proBadge: {
    alignSelf: "center",
    backgroundColor: "#1C2A0E",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  proBadgeText: {
    ...TypeScale.captionSm,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginTop: 16,
  },
  statsGrid: {
    flexDirection: "row",
    marginTop: 16,
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#F0F0F0",
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.4,
    color: "#1A1A1A",
  },
  statLabel: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "#888888",
    marginTop: 4,
  },

  // Menu
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  menuSectionTitle: {
    ...TypeScale.captionLg,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#888888",
    marginBottom: 12,
  },
  menuCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.09,
    shadowRadius: 45,
    elevation: 4,
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
  menuLabel: {
    ...TypeScale.bodyLg,
    flex: 1,
    color: "#1A1A1A",
  },
  notifBadge: {
    backgroundColor: "#FF6B1A",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginRight: 12,
  },
  notifBadgeText: {
    ...TypeScale.captionXs,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  activeBadge: {
    backgroundColor: "#4A7A28",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  activeBadgeText: {
    ...TypeScale.captionSm,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Sign Out
  signOutWrapper: {
    paddingHorizontal: 20,
    marginTop: 24,
    paddingBottom: 32,
  },
  signOutButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FF6B1A",
  },
});
