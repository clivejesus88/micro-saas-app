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
import {
  Bell,
  ScanLine,
  Tag,
  TrendingDown,
} from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { useSaved } from "@/contexts/saved-context";
import { ALL_SCANS } from "@/constants/scans-data";
import { TypeScale } from "@/constants/typography";

interface Category {
  id: string;
  label: string;
}

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
  const { savedIds } = useSaved();
  const {
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useScrollContext();

  const savedItems = useMemo(() => {
    return ALL_SCANS.filter((scan) => savedIds.has(scan.id)).map((scan) => ({
      id: scan.id,
      name: scan.name,
      originalPrice: scan.retailPrice,
      price: scan.retailPrice - scan.savings,
      imageUrl: scan.image,
      markup: parseInt(scan.markup.replace("%", ""), 10),
    }));
  }, [savedIds]);

  const totalSaved = useMemo(() => {
    return savedItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);
  }, [savedItems]);

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
          <Text style={styles.totalAmount}>${(totalSaved || TOTAL_SAVED).toLocaleString()}</Text>

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
              style={({ pressed }) => [
                styles.categoryPill,
                index === 0 && styles.categoryPillActive,
                pressed && { opacity: 0.7 },
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
              <Text style={styles.countText}>{savedItems.length}</Text>
            </View>
          </View>

          {savedItems.length === 0 ? (
            <View style={styles.emptyVault}>
              <Text style={styles.emptyTitle}>No saved items yet</Text>
              <Text style={styles.emptyDesc}>
                Bookmark items from your scans to save them here
              </Text>
            </View>
          ) : (
            <View style={styles.itemsGrid}>
              {savedItems.map((item) => (
                <Pressable key={item.id} style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]} onPress={() => router.push({ pathname: "/analysis", params: { productId: item.id } })}>
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
  emptyVault: {
    alignItems: "center",
    paddingVertical: 40,
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

  // Card
  card: {
    width: "47.5%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
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
    top: 8,
    right: 8,
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
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
