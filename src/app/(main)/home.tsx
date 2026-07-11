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
import { useResponsive } from "@/hooks/use-responsive";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT, MARKUP_CARD_RATIO } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

interface ProductItem {
  id: string;
  name: string;
  originalPrice: number;
  alternativePrice: number;
  imageUrl: string;
  markup: number;
}

interface DayItem {
  id: string;
  day: string;
  date: string;
  isToday: boolean;
}

const DATE_STRIP: DayItem[] = [
  { id: "sun-21", day: "Sun", date: "21", isToday: false },
  { id: "mon-22", day: "Mon", date: "22", isToday: false },
  { id: "tue-23", day: "Tue", date: "23", isToday: false },
  { id: "wed-24", day: "Wed", date: "24", isToday: true },
  { id: "thu-25", day: "Thu", date: "25", isToday: false },
  { id: "fri-26", day: "Fri", date: "26", isToday: false },
  { id: "sat-27", day: "Sat", date: "27", isToday: false },
];

const TOP_MARKUPS: ProductItem[] = [
  {
    id: "limited-run-designer-sneaker",
    name: "Limited-Run Designer Sneaker",
    originalPrice: 1180,
    alternativePrice: 420,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop",
    markup: 380,
  },
  {
    id: "structured-leather-handbag",
    name: "Structured Leather Handbag",
    originalPrice: 4600,
    alternativePrice: 1380,
    imageUrl:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=900&auto=format&fit=crop",
    markup: 520,
  },
  {
    id: "titanium-smartwatch",
    name: "Titanium Smartwatch",
    originalPrice: 890,
    alternativePrice: 345,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop",
    markup: 290,
  },
  {
    id: "technical-shell-jacket",
    name: "Technical Shell Jacket",
    originalPrice: 1650,
    alternativePrice: 590,
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=900&auto=format&fit=crop",
    markup: 440,
  },
];

const TRENDING_FINDS: ProductItem[] = [
  {
    id: "noise-canceling-headphones",
    name: "Noise-Canceling Headphones",
    originalPrice: 620,
    alternativePrice: 310,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    markup: 210,
  },
  {
    id: "automatic-dress-watch",
    name: "Automatic Dress Watch",
    originalPrice: 2400,
    alternativePrice: 1120,
    imageUrl:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1200&auto=format&fit=crop",
    markup: 360,
  },
];

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

  const markupCardWidth = Math.round(screenWidth * MARKUP_CARD_RATIO);
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
          <Image
            source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=240&auto=format&fit=crop"
            style={styles.avatar}
            contentFit="cover"
          />
        </View>

        <View style={styles.dateStrip}>
          {DATE_STRIP.map((day) => (
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.markupScroll}
            contentContainerStyle={[
              styles.markupScrollContent,
              { paddingHorizontal: Math.max(20, screenWidth * 0.05) },
            ]}
          >
            {TOP_MARKUPS.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.markupCard, { width: markupCardWidth }, pressed && { opacity: 0.92 }]}
                onPress={() => router.push({ pathname: "/analysis", params: { productId: item.id } })}
              >
                <Image
                  source={item.imageUrl}
                  style={styles.markupImage}
                  contentFit="cover"
                />
                <View style={styles.markupBody}>
                  <Text style={styles.markupName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.markupFooter}>
                    <Text style={styles.markupPrice}>
                      ${item.alternativePrice.toLocaleString()}
                    </Text>
                    <View style={styles.markupBadge}>
                      <Text style={styles.markupBadgeText}>
                        {item.markup}% Markup
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Trending Finds</Text>
            <Pressable onPress={() => router.push("/history")} style={({ pressed }) => pressed && { opacity: 0.5 }}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.trendingList}>
            {TRENDING_FINDS.map((item) => (
              <Pressable key={item.id} style={({ pressed }) => [styles.trendingCard, pressed && { opacity: 0.92 }]} onPress={() => router.push({ pathname: "/analysis", params: { productId: item.id } })}>
                <Image
                  source={item.imageUrl}
                  style={styles.trendingImage}
                  contentFit="cover"
                />
                <View style={styles.trendingBody}>
                  <View style={styles.trendingTopRow}>
                    <View style={styles.trendingInfo}>
                      <Text style={styles.trendingName}>{item.name}</Text>
                      <View style={styles.trendingPriceRow}>
                        <Text style={styles.trendingOriginal}>
                          ${item.originalPrice.toLocaleString()}
                        </Text>
                        <Text style={styles.trendingPrice}>
                          ${item.alternativePrice.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.trendingBadge}>
                      <Text style={styles.trendingBadgeText}>
                        {item.markup}% markup
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
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
  markupScroll: {
    marginTop: 16,
    marginHorizontal: -20,
  },
  markupScrollContent: {
    gap: 12,
    paddingBottom: 24,
  },
  markupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  markupImage: {
    aspectRatio: 1.08,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  markupBody: {
    marginTop: 12,
    gap: 8,
  },
  markupName: {
    ...TypeScale.captionLg,
    fontWeight: "700",
    color: "#1A1A1A",
    minHeight: 32,
  },
  markupFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  markupPrice: {
    ...TypeScale.captionMd,
    fontWeight: "600",
    color: "#4A7A28",
  },
  markupBadge: {
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  markupBadgeText: {
    ...TypeScale.captionXs,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  trendingList: {
    marginTop: 16,
    gap: 20,
  },
  trendingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  trendingImage: {
    aspectRatio: 4 / 3,
    width: "100%",
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
  },
  trendingBody: {
    paddingHorizontal: 6,
    paddingTop: 16,
    paddingBottom: 8,
  },
  trendingTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  trendingInfo: {
    flex: 1,
    gap: 8,
  },
  trendingName: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: -0.4,
  },
  trendingPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  trendingOriginal: {
    ...TypeScale.mutedSm,
    color: "#888888",
    textDecorationLine: "line-through",
  },
  trendingPrice: {
    ...TypeScale.bodyLg,
    fontWeight: "700",
    color: "#4A7A28",
  },
  trendingBadge: {
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  trendingBadgeText: {
    ...TypeScale.captionSm,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
