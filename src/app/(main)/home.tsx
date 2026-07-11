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
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
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
  const router = useRouter();
  const {
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useScrollContext();

  const weekDays = useMemo(() => buildWeekDays(), []);
  const bottomSpacer = BOTTOM_NAV_HEIGHT + insets.bottom + 20;

  return (
    <View style={styles.root}>
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
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.userName}>Alex Rivera</Text>
          </View>
          <Pressable onPress={() => router.push("/profile")}>
            <Image
              source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=240&auto=format&fit=crop"
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
                day.isToday && styles.datePillActive,
              ]}
            >
              <Text
                style={[
                  styles.datePillDay,
                  day.isToday && styles.datePillTextActive,
                ]}
              >
                {day.day}
              </Text>
              <Text
                style={[
                  styles.datePillDate,
                  day.isToday && styles.datePillTextActive,
                ]}
              >
                {day.date}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Markups Today</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No markups yet</Text>
            <Text style={styles.emptyDesc}>
              Scan products to see markup opportunities here
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push("/scan")}
            >
              <ScanLine size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.emptyButtonText}>Start Scanning</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Trending Finds</Text>
            <Pressable onPress={() => router.push("/history")}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No trending items</Text>
            <Text style={styles.emptyDesc}>
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
    backgroundColor: "#FFFFFF",
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
    color: "#888888",
  },
  userName: {
    ...TypeScale.headingMd,
    marginTop: 4,
    color: "#1A1A1A",
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
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  datePillActive: {
    backgroundColor: "#2D4A1E",
    shadowColor: "#2D4A1E",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 6,
  },
  datePillDay: {
    ...TypeScale.captionSm,
    color: "#888888",
  },
  datePillDate: {
    ...TypeScale.captionLg,
    color: "#888888",
  },
  datePillTextActive: {
    color: "#FFFFFF",
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
    color: "#1A1A1A",
  },
  seeAll: {
    ...TypeScale.captionLg,
    color: "#FF6B1A",
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
    color: "#1A1A1A",
  },
  emptyDesc: {
    ...TypeScale.mutedSm,
    color: "#AAAAAA",
    textAlign: "center",
    maxWidth: 260,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: "#1C2A0E",
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
