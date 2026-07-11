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
import {
  Bell,
  ScanLine,
  Tag,
  TrendingDown,
} from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

interface SavedItem {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  imageUrl: string;
  markup: number;
}

interface Category {
  id: string;
  label: string;
}

const SAVED_ITEMS: SavedItem[] = [
  {
    id: "limited-run-designer-sneaker",
    name: "Limited-Run Designer Sneaker",
    originalPrice: 1180,
    price: 420,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop",
    markup: 380,
  },
  {
    id: "structured-leather-handbag",
    name: "Structured Leather Handbag",
    originalPrice: 4600,
    price: 1380,
    imageUrl:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=900&auto=format&fit=crop",
    markup: 520,
  },
  {
    id: "titanium-smartwatch",
    name: "Titanium Smartwatch",
    originalPrice: 890,
    price: 345,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop",
    markup: 290,
  },
  {
    id: "technical-shell-jacket",
    name: "Technical Shell Jacket",
    originalPrice: 1650,
    price: 590,
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=900&auto=format&fit=crop",
    markup: 440,
  },
];

const CATEGORIES: Category[] = [
  { id: "all", label: "All Items" },
  { id: "fashion", label: "Fashion" },
  { id: "electronics", label: "Electronics" },
  { id: "home", label: "Home" },
  { id: "sneakers", label: "Sneakers" },
];

const TOTAL_SAVED = 4820;
const SAVINGS_GOAL = 6000;
const PROGRESS = Math.min(TOTAL_SAVED / SAVINGS_GOAL, 1);

export default function VaultScreen() {
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
        {/* Hero Card */}
        <View style={[styles.heroCard, { marginTop: insets.top + 24 }]}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>My Vault</Text>
            <Pressable style={styles.bellButton} hitSlop={8}>
              <Bell size={22} color="#FFFFFF" strokeWidth={2.1} />
            </Pressable>
          </View>

          <Text style={styles.totalLabel}>Total Saved</Text>
          <Text style={styles.totalAmount}>${TOTAL_SAVED.toLocaleString()}</Text>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]}
            />
          </View>
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Savings Goal</Text>
            <Text style={styles.goalAmount}>
              ${SAVINGS_GOAL.toLocaleString()}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <ScanLine size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.statText}>47 Scans</Text>
            </View>
            <View style={styles.statPill}>
              <Tag size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.statText}>Avg 68% Off</Text>
            </View>
            <View style={styles.statPill}>
              <TrendingDown size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.statText}>$3,240 Saved</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat, index) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryPill,
                index === 0 && styles.categoryPillActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  index === 0 && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Saved Items */}
        <View style={styles.savedSection}>
          <View style={styles.savedHeader}>
            <Text style={styles.savedTitle}>Saved Items</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{SAVED_ITEMS.length * 3}</Text>
            </View>
          </View>

          <View style={styles.itemsGrid}>
            {SAVED_ITEMS.map((item) => (
              <Pressable key={item.id} style={styles.card} onPress={() => router.push({ pathname: "/analysis", params: { productId: item.id } })}>
                <View style={styles.cardImageWrapper}>
                  <Image
                    source={item.imageUrl}
                    style={styles.cardImage}
                    contentFit="cover"
                  />
                  <View style={styles.markupBadge}>
                    <Text style={styles.markupBadgeText}>
                      {item.markup}%
                    </Text>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardOriginalPrice}>
                    ${item.originalPrice.toLocaleString()}
                  </Text>
                  <Text style={styles.cardPrice}>
                    ${item.price.toLocaleString()}
                  </Text>
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

  // Hero Card
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 28,
    backgroundColor: "#1C2A0E",
    padding: 24,
    shadowColor: "#1C2A0E",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.24,
    shadowRadius: 70,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
    letterSpacing: -0.44,
    color: "#FFFFFF",
  },
  bellButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  totalLabel: {
    ...TypeScale.captionLg,
    fontWeight: "400",
    color: "rgba(255,255,255,0.6)",
    marginTop: 16,
  },
  totalAmount: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 48,
    fontWeight: "800",
    lineHeight: 52,
    letterSpacing: -1.92,
    color: "#FFFFFF",
    marginTop: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#FF6B1A",
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  goalLabel: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "rgba(255,255,255,0.5)",
  },
  goalAmount: {
    ...TypeScale.captionMd,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  statPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  statText: {
    ...TypeScale.captionMd,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  // Category Filter
  categoryScroll: {
    marginTop: 24,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  categoryPillActive: {
    backgroundColor: "#1C2A0E",
  },
  categoryText: {
    ...TypeScale.captionLg,
    fontWeight: "500",
    color: "#888888",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },

  // Saved Items
  savedSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  savedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  savedTitle: {
    ...TypeScale.sectionMd,
    color: "#1A1A1A",
  },
  countBadge: {
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    ...TypeScale.captionSm,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 16,
  },

  // Card
  card: {
    width: "47.5%",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.09,
    shadowRadius: 45,
    elevation: 4,
  },
  cardImageWrapper: {
    position: "relative",
    backgroundColor: "#F5F5F5",
  },
  cardImage: {
    aspectRatio: 1,
    width: "100%",
  },
  markupBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 24,
  },
  markupBadgeText: {
    ...TypeScale.captionSm,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cardBody: {
    padding: 12,
  },
  cardName: {
    ...TypeScale.captionLg,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
  },
  cardOriginalPrice: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "#AAAAAA",
    textDecorationLine: "line-through",
    marginTop: 4,
  },
  cardPrice: {
    ...TypeScale.bodyMd,
    fontWeight: "700",
    color: "#4A7A28",
    marginTop: 2,
  },
});
