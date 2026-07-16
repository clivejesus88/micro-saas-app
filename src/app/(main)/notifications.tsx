import { useState } from "react";
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
  Bell,
  TrendingDown,
  ScanLine,
  Tag,
  Clock,
  CheckCheck,
  X,
} from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

interface Notification {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  timeAgo: string;
}

interface NotificationItem extends Notification {
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    icon: TrendingDown,
    iconBg: "#F0F6E8",
    iconColor: "#4A7A28",
    title: "Price Drop Alert",
    description: "Air Jordan 1 Retro dropped 12% on StockX",
    timeAgo: "2h ago",
    isRead: false,
  },
  {
    id: "2",
    icon: ScanLine,
    iconBg: "#FFF0E6",
    iconColor: "#FF6B1A",
    title: "Scan Complete",
    description: "Your analysis of Gucci GG Canvas Tote is ready",
    timeAgo: "5h ago",
    isRead: false,
  },
  {
    id: "3",
    icon: Tag,
    iconBg: "#F0F6E8",
    iconColor: "#4A7A28",
    title: "New Markup Found",
    description: "Dyson Airwrap has 274% markup detected",
    timeAgo: "Yesterday",
    isRead: false,
  },
  {
    id: "4",
    icon: Bell,
    iconBg: "#F5F5F5",
    iconColor: "#888888",
    title: "Saved Item Update",
    description: "Levi's 501 Jeans is now in stock at your saved price",
    timeAgo: "2 days ago",
    isRead: true,
  },
  {
    id: "5",
    icon: ScanLine,
    iconBg: "#FFF0E6",
    iconColor: "#FF6B1A",
    title: "Weekly Summary",
    description: "You saved $840 this week across 6 scans",
    timeAgo: "3 days ago",
    isRead: true,
  },
  {
    id: "6",
    icon: TrendingDown,
    iconBg: "#F0F6E8",
    iconColor: "#4A7A28",
    title: "Price Drop Alert",
    description: "Ray-Ban Aviators dropped 8% on Amazon",
    timeAgo: "5 days ago",
    isRead: true,
  },
];

const NOTIF_SCAN_MAP: Record<string, string> = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "6": "6",
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const {
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useScrollContext();

  const bottomSpacer = BOTTOM_NAV_HEIGHT + insets.bottom + 20;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotifPress = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    const scanId = NOTIF_SCAN_MAP[notif.id];
    if (scanId) {
      router.push({ pathname: "/analysis", params: { productId: scanId } });
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 ? (
            <Pressable style={styles.markAllBtn} onPress={markAllRead}>
              <CheckCheck size={16} color="#4A7A28" strokeWidth={2} />
              <Text style={styles.markAllText}>Read all</Text>
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Notification List */}
        <View style={styles.notifList}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptyDesc}>
                You&apos;re all caught up!
              </Text>
            </View>
          ) : (
            notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <Pressable
                  key={notif.id}
                  style={({ pressed }) => [
                    styles.notifCard,
                    pressed && { opacity: 0.92 },
                    !notif.isRead && styles.notifCardUnread,
                  ]}
                  onPress={() => handleNotifPress(notif)}
                >
                  <View style={[styles.notifIcon, { backgroundColor: notif.iconBg }]}>
                    <Icon size={20} color={notif.iconColor} strokeWidth={2} />
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifTitleRow}>
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      {!notif.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notifDesc}>{notif.description}</Text>
                    <View style={styles.notifTimeRow}>
                      <Clock size={12} color="#AAAAAA" strokeWidth={2} />
                      <Text style={styles.notifTime}>{notif.timeAgo}</Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.deleteButton}
                    hitSlop={8}
                    onPress={() => deleteNotification(notif.id)}
                  >
                    <X size={16} color="#CCCCCC" strokeWidth={2} />
                  </Pressable>
                </Pressable>
              );
            })
          )}
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
    flex: 1,
    textAlign: "center",
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  markAllText: {
    ...TypeScale.captionSm,
    fontWeight: "600",
    color: "#4A7A28",
  },
  notifList: {
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  notifCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  notifCardUnread: {
    borderColor: "rgba(74,122,40,0.15)",
    backgroundColor: "#FAFDF7",
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notifTitle: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4A7A28",
  },
  notifDesc: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "#888888",
    marginTop: 4,
  },
  notifTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  notifTime: {
    ...TypeScale.captionSm,
    fontWeight: "400",
    color: "#AAAAAA",
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  emptyDesc: {
    ...TypeScale.mutedSm,
    color: "#AAAAAA",
    textAlign: "center",
  },
});
