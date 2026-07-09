import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MAX_WIDTH = 430;
const CONTAINER_WIDTH = Math.min(SCREEN_WIDTH, MAX_WIDTH);

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

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#1C2A0E", "#2D4A1E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroTextCol}>
              <View style={styles.greetingRow}>
                <SymbolView
                  name="sparkles"
                  size={14}
                  tintColor="#A8D68A"
                  weight="semibold"
                />
                <Text style={styles.greeting}>Good morning</Text>
              </View>
              <Text style={styles.heroName}>Alex Rivera</Text>
            </View>
            <Image
              source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=240&auto=format&fit=crop"
              style={styles.avatar}
              contentFit="cover"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateStripScroll}
            contentContainerStyle={styles.dateStripContent}
          >
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
          </ScrollView>
        </LinearGradient>

        <View style={styles.bodySection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Top Markups Today</Text>
            <Pressable>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.markupScroll}
            contentContainerStyle={styles.markupScrollContent}
          >
            {TOP_MARKUPS.map((item) => (
              <Pressable key={item.id} style={styles.markupCard}>
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

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Trending Finds</Text>
            <Pressable>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.trendingList}>
            {TRENDING_FINDS.map((item) => (
              <Pressable key={item.id} style={styles.trendingCard}>
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

        <View style={{ height: 140 }} />
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
  hero: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTextCol: {
    flexDirection: "column",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "500",
    color: "#A8D68A",
    letterSpacing: 0.3,
  },
  heroName: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  dateStripScroll: {
    marginTop: 24,
    marginHorizontal: -24,
  },
  dateStripContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  datePill: {
    minWidth: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    gap: 2,
  },
  datePillActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#2D4A1E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  datePillDay: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    lineHeight: 14,
  },
  datePillDate: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
  },
  datePillTextActive: {
    color: "#1C2A0E",
  },
  bodySection: {
    width: CONTAINER_WIDTH - 32,
    marginTop: 28,
  },
  sectionHeaderRow: {
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
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B1A",
  },
  markupScroll: {
    marginHorizontal: -16,
  },
  markupScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  markupCard: {
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  markupImage: {
    aspectRatio: 1.08,
    width: "100%",
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
  },
  markupBody: {
    marginTop: 12,
    gap: 10,
  },
  markupName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 16,
    letterSpacing: -0.15,
    minHeight: 32,
  },
  markupFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  markupPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A7A28",
  },
  markupBadge: {
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  markupBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 12,
  },
  trendingList: {
    gap: 16,
  },
  trendingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 6,
  },
  trendingImage: {
    aspectRatio: 4 / 3,
    width: "100%",
    backgroundColor: "#F5F5F5",
  },
  trendingBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  trendingTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  trendingInfo: {
    flex: 1,
    gap: 8,
  },
  trendingName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: -0.3,
  },
  trendingPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  trendingOriginal: {
    fontSize: 14,
    fontWeight: "400",
    color: "#888888",
    textDecorationLine: "line-through",
  },
  trendingPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A7A28",
    letterSpacing: -0.2,
  },
  trendingBadge: {
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#FF6B1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  trendingBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 14,
  },
});
