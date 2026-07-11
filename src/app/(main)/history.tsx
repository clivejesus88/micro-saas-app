import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Bookmark,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

interface StatItem {
  value: string;
  label: string;
  color?: string;
}

interface ScanItem {
  id: string;
  name: string;
  category: string;
  retailPrice: number;
  savings: number;
  markup: string;
  timeAgo: string;
  isSaved: boolean;
  image: string;
}

const STATS_DATA: StatItem[] = [
  { value: "47", label: "Total Scans" },
  { value: "$8,240", label: "Total Saved", color: "#4A7A28" },
  { value: "68%", label: "Avg Markup", color: "#FF6B1A" },
];

const FILTER_CHIPS = [
  "All",
  "Fashion",
  "Electronics",
  "Home",
  "Sneakers",
  "Accessories",
];

const SCANS_DATA: ScanItem[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro",
    category: "Sneakers",
    retailPrice: 180,
    savings: 112,
    markup: "165%",
    timeAgo: "2h ago",
    isSaved: true,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "2",
    name: "Gucci GG Canvas Tote",
    category: "Bags",
    retailPrice: 1200,
    savings: 1050,
    markup: "700%",
    timeAgo: "5h ago",
    isSaved: true,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "3",
    name: "Dyson Airwrap",
    category: "Electronics",
    retailPrice: 599,
    savings: 380,
    markup: "274%",
    timeAgo: "Yesterday",
    isSaved: false,
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "4",
    name: "Levi's 501 Jeans",
    category: "Fashion",
    retailPrice: 89,
    savings: 61,
    markup: "218%",
    timeAgo: "2 days ago",
    isSaved: false,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "5",
    name: "Le Creuset Dutch Oven",
    category: "Home",
    retailPrice: 420,
    savings: 318,
    markup: "312%",
    timeAgo: "3 days ago",
    isSaved: true,
    image:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "6",
    name: "Ray-Ban Aviators",
    category: "Accessories",
    retailPrice: 210,
    savings: 168,
    markup: "400%",
    timeAgo: "5 days ago",
    isSaved: false,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
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
          <Text style={styles.headerTitle}>History</Text>
          <Pressable style={styles.filterButton} hitSlop={8}>
            <SlidersHorizontal
              size={22}
              color="#1A1A1A"
              strokeWidth={1.5}
            />
          </Pressable>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS_DATA.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text
                style={[
                  styles.statValue,
                  { color: stat.color || "#1A1A1A" },
                ]}
              >
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Search size={18} color="#AAAAAA" strokeWidth={1.8} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search past scans..."
              placeholderTextColor="#BBBBBB"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipContent}
        >
          {FILTER_CHIPS.map((chip) => (
            <Pressable
              key={chip}
              style={[
                styles.chip,
                activeFilter === chip && styles.chipActive,
              ]}
              onPress={() => setActiveFilter(chip)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === chip && styles.chipTextActive,
                ]}
              >
                {chip}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Recent Scans Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <Pressable style={styles.sortButton}>
            <Text style={styles.sortText}>Sort by: Latest</Text>
            <ChevronDown size={14} color="#888888" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Scan List */}
        <View style={styles.scanList}>
          {SCANS_DATA.map((scan) => (
            <Pressable key={scan.id} style={styles.scanCard} onPress={() => router.push({ pathname: "/analysis", params: { productId: scan.id } })}>
              <Image
                source={scan.image}
                style={styles.scanImage}
                contentFit="cover"
              />

              <View style={styles.scanInfo}>
                <Text style={styles.scanName} numberOfLines={1}>
                  {scan.name}
                </Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{scan.category}</Text>
                </View>
                <Text style={styles.scanPricing}>
                  Retail{" "}
                  <Text style={styles.scanPricingBold}>
                    ${scan.retailPrice}
                  </Text>{" "}
                  · You save{" "}
                  <Text style={styles.scanPricingGreen}>
                    ${scan.savings}
                  </Text>
                </Text>
              </View>

              <View style={styles.scanRight}>
                <View style={styles.markupBadge}>
                  <Text style={styles.markupBadgeText}>{scan.markup}</Text>
                </View>
                <Text style={styles.scanTime}>{scan.timeAgo}</Text>
                <Pressable style={styles.bookmarkButton} hitSlop={8}>
                  <Bookmark
                    size={16}
                    color={scan.isSaved ? "#4A7A28" : "#C4C4C4"}
                    strokeWidth={2}
                    fill={scan.isSaved ? "#4A7A28" : "transparent"}
                  />
                </Pressable>
              </View>
            </Pressable>
          ))}
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
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 36,
    letterSpacing: -0.96,
    color: "#1A1A1A",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.48,
  },
  statLabel: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "#888888",
    marginTop: 4,
  },

  // Search
  searchWrapper: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  searchBar: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "#1A1A1A",
    padding: 0,
  },

  // Chips
  chipScroll: {
    marginTop: 16,
  },
  chipContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  chipActive: {
    backgroundColor: "#1C2A0E",
  },
  chipText: {
    ...TypeScale.captionLg,
    fontWeight: "500",
    color: "#888888",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.4,
    color: "#1A1A1A",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    ...TypeScale.captionMd,
    fontWeight: "500",
    color: "#888888",
  },

  // Scan List
  scanList: {
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 8,
  },
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    gap: 16,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.09,
    shadowRadius: 45,
    elevation: 4,
  },
  scanImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  scanInfo: {
    flex: 1,
    minWidth: 0,
  },
  scanName: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  categoryText: {
    ...TypeScale.captionSm,
    fontWeight: "500",
    color: "#888888",
  },
  scanPricing: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "#888888",
    marginTop: 8,
  },
  scanPricingBold: {
    fontWeight: "500",
    color: "#1A1A1A",
  },
  scanPricingGreen: {
    fontWeight: "500",
    color: "#4A7A28",
  },
  scanRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  markupBadge: {
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#FF6B1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  markupBadgeText: {
    ...TypeScale.captionMd,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scanTime: {
    ...TypeScale.captionSm,
    fontWeight: "400",
    color: "#AAAAAA",
  },
  bookmarkButton: {
    padding: 4,
  },
});
