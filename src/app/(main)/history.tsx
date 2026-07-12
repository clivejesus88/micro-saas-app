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
import { BottomSheet } from "@expo/ui";
import {
  Bookmark,
  ChevronDown,
  Check,
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

const SORT_OPTIONS = [
  { key: "latest", label: "Latest" },
  { key: "oldest", label: "Oldest" },
  { key: "price-high", label: "Price: High to Low" },
  { key: "price-low", label: "Price: Low to High" },
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [tempSortBy, setTempSortBy] = useState("latest");
  const [tempFilter, setTempFilter] = useState("All");
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
          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              pressed && { opacity: 0.7 },
            ]}
            hitSlop={8}
            onPress={() => {
              setTempSortBy(sortBy);
              setTempFilter(activeFilter);
              setIsFilterOpen(true);
            }}
          >
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
              style={({ pressed }) => [
                styles.chip,
                activeFilter === chip && styles.chipActive,
                pressed && { opacity: 0.7 },
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
          <Pressable style={({ pressed }) => [styles.sortButton, pressed && { opacity: 0.6 }]}>
            <Text style={styles.sortText}>
              Sort by: {SORT_OPTIONS.find((o) => o.key === sortBy)?.label ?? "Latest"}
            </Text>
            <ChevronDown size={14} color="#888888" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Scan List */}
        <View style={styles.scanList}>
          {SCANS_DATA.map((scan) => (
            <Pressable key={scan.id} style={({ pressed }) => [styles.scanCard, pressed && { opacity: 0.92 }]} onPress={() => router.push({ pathname: "/analysis", params: { productId: scan.id } })}>
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

      <BottomSheet
        isPresented={isFilterOpen}
        onDismiss={() => setIsFilterOpen(false)}
        snapPoints={["50%"]}
      >
        <View style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter & Sort</Text>
            <Pressable
              onPress={() => {
                setIsFilterOpen(false);
              }}
              hitSlop={8}
            >
              <Text style={styles.sheetClose}>Done</Text>
            </Pressable>
          </View>

          {/* Sort Section */}
          <Text style={styles.sheetSectionLabel}>Sort by</Text>
          <View style={styles.sheetSortGroup}>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  styles.sheetSortOption,
                  tempSortBy === opt.key && styles.sheetSortOptionActive,
                ]}
                onPress={() => setTempSortBy(opt.key)}
              >
                <Text
                  style={[
                    styles.sheetSortText,
                    tempSortBy === opt.key && styles.sheetSortTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {tempSortBy === opt.key && (
                  <Check size={16} color="#1B4332" strokeWidth={2.5} />
                )}
              </Pressable>
            ))}
          </View>

          {/* Category Section */}
          <Text style={styles.sheetSectionLabel}>Category</Text>
          <View style={styles.sheetChipRow}>
            {FILTER_CHIPS.map((chip) => (
              <Pressable
                key={chip}
                style={[
                  styles.sheetChip,
                  tempFilter === chip && styles.sheetChipActive,
                ]}
                onPress={() => setTempFilter(chip)}
              >
                <Text
                  style={[
                    styles.sheetChipText,
                    tempFilter === chip && styles.sheetChipTextActive,
                  ]}
                >
                  {chip}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Apply / Reset */}
          <View style={styles.sheetActions}>
            <Pressable
              style={styles.sheetResetBtn}
              onPress={() => {
                setTempSortBy("latest");
                setTempFilter("All");
              }}
            >
              <Text style={styles.sheetResetText}>Reset</Text>
            </Pressable>
            <Pressable
              style={styles.sheetApplyBtn}
              onPress={() => {
                setSortBy(tempSortBy);
                setActiveFilter(tempFilter);
                setIsFilterOpen(false);
              }}
            >
              <Text style={styles.sheetApplyText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
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
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  scanImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
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
    borderRadius: 10,
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

  // Bottom Sheet
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  sheetTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  sheetClose: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#4A7A28",
  },
  sheetSectionLabel: {
    ...TypeScale.captionLg,
    fontWeight: "600",
    color: "#888888",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sheetSortGroup: {
    gap: 4,
    marginBottom: 24,
  },
  sheetSortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  sheetSortOptionActive: {
    backgroundColor: "#E8F0E0",
  },
  sheetSortText: {
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "#1A1A1A",
  },
  sheetSortTextActive: {
    fontWeight: "600",
    color: "#1B4332",
  },
  sheetChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },
  sheetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  sheetChipActive: {
    backgroundColor: "#1C2A0E",
  },
  sheetChipText: {
    ...TypeScale.captionLg,
    fontWeight: "500",
    color: "#888888",
  },
  sheetChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  sheetActions: {
    flexDirection: "row",
    gap: 12,
  },
  sheetResetBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
  },
  sheetResetText: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#888888",
  },
  sheetApplyBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#1B4332",
  },
  sheetApplyText: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
