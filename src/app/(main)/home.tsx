import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScanLine } from "lucide-react-native";
import { useResponsive } from "@/hooks/use-responsive";
import { useAppColors } from "@/hooks/use-app-colors";
import { BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { useUserProfile } from "@/contexts/user-context";
import { TypeScale } from "@/constants/typography";

interface DayItem {
  id: string;
  day: string;
  date: string;
  isToday: boolean;
}

function buildWeekDays(): DayItem[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      id: `day-${d.toISOString().slice(0, 10)}`,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: String(d.getDate()),
      isToday: d.toDateString() === today.toDateString(),
    };
  });
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { screenWidth } = useResponsive();
  const { colors } = useAppColors();
  const router = useRouter();
  const { name, avatarUri } = useUserProfile();
  const {
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useScrollContext();

  const weekDays = useMemo(() => buildWeekDays(), []);
  const bottomSpacer = BOTTOM_NAV_HEIGHT + insets.bottom + 20;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingHorizontal: Math.max(20, screenWidth * 0.05),
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>Good morning</Text>
            <Text style={[styles.userName, { color: colors.text }]}>{name}</Text>
          </View>
          <Pressable onPress={() => router.push("/profile")}>
            <Image
              source={avatarUri || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=240&auto=format&fit=crop"}
              style={styles.avatar}
              contentFit="cover"
            />
          </Pressable>
        </View>

        <View style={styles.dateStrip}>
          {weekDays.map((day) => (
            <Pressable
              key={day.id}
              style={[
                styles.datePill,
                { backgroundColor: colors.surface },
                day.isToday && { backgroundColor: colors.accentDark },
              ]}
            >
              <Text
                style={[
                  styles.datePillDay,
                  { color: colors.textSecondary },
                  day.isToday && { color: colors.white },
                ]}
              >
                {day.day}
              </Text>
              <Text
                style={[
                  styles.datePillDate,
                  { color: colors.textSecondary },
                  day.isToday && { color: colors.white },
                ]}
              >
                {day.date}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Markups Today</Text>
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No markups yet</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
              Scan products to see markup opportunities here
            </Text>
            <Pressable
              style={[styles.emptyButton, { backgroundColor: colors.accentDeep }]}
              onPress={() => router.push("/scan")}
            >
              <ScanLine size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.emptyButtonText}>Start Scanning</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Finds</Text>
            <Pressable onPress={() => router.push("/history")}>
              <Text style={[styles.seeAll, { color: colors.orange }]}>See all</Text>
            </Pressable>
          </View>
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No trending items</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
              Trending products will appear here as you scan
            </Text>
          </View>
        </View>

        <View style={{ height: bottomSpacer }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    ...TypeScale.mutedSm,
  },
  userName: {
    ...TypeScale.headingMd,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 34,
    elevation: 8,
  },
  dateStrip: {
    flexDirection: "row",
    marginTop: 36,
    gap: 6,
  },
  datePill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 28,
    gap: 4,
  },
  datePillDay: {
    ...TypeScale.captionSm,
  },
  datePillDate: {
    ...TypeScale.captionLg,
  },
  section: {
    marginTop: 40,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    ...TypeScale.sectionMd,
  },
  seeAll: {
    ...TypeScale.captionLg,
  },
  emptyState: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
  },
  emptyDesc: {
    ...TypeScale.mutedSm,
    textAlign: "center",
    maxWidth: 260,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
