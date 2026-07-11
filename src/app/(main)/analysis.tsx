import { useState } from "react";
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
  ArrowUpRight,
  ChevronLeft,
  Copy,
  Globe,
  Layers2,
  Leaf,
  RefreshCw,
  Scissors,
  Share2,
} from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

interface MaterialRow {
  id: string;
  icon: "upholstery" | "frame" | "labor";
  name: string;
  cost: string;
}

interface RetailSource {
  id: string;
  initial: string;
  name: string;
  shipping: string;
  price: string;
  savings: string;
  isBestDeal?: boolean;
}

interface AlternativeItem {
  id: string;
  name: string;
  price: string;
  markup: string;
  imageUrl: string;
}

const HERO_ITEM = {
  name: "Designer Court Sneaker",
  retailPrice: "$680",
  materialCost: "$128",
  savings: "$552",
  markupPercent: "431%",
  markup: "420% Markup",
  imageUrl:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=1200",
};

const MATERIAL_ROWS: MaterialRow[] = [
  {
    id: "premium-leather-upper",
    icon: "upholstery",
    name: "Premium Leather Upper",
    cost: "$38",
  },
  {
    id: "rubber-outsole",
    icon: "frame",
    name: "Rubber Outsole",
    cost: "$24",
  },
  {
    id: "brand-label-premium",
    icon: "labor",
    name: "Brand Label Premium",
    cost: "$66",
  },
];

const RETAIL_SOURCES: RetailSource[] = [
  {
    id: "amazon",
    initial: "A",
    name: "Amazon",
    shipping: "Free shipping · 2 days Prime",
    price: "$189",
    savings: "Save $491",
  },
  {
    id: "walmart",
    initial: "W",
    name: "Walmart",
    shipping: "Free shipping · 5-7 days",
    price: "$210",
    savings: "Save $470",
  },
  {
    id: "ebay",
    initial: "E",
    name: "eBay",
    shipping: "From $4.99 shipping",
    price: "$165",
    savings: "Save $515",
    isBestDeal: true,
  },
  {
    id: "aliexpress",
    initial: "A",
    name: "AliExpress",
    shipping: "Free shipping · 14-21 days",
    price: "$98",
    savings: "Save $582",
  },
];

const ALTERNATIVES: AlternativeItem[] = [
  {
    id: "minimal-leather-sneaker",
    name: "Minimal Leather Sneaker",
    price: "$165",
    markup: "129%",
    imageUrl:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=85&w=800",
  },
  {
    id: "clean-court-trainer",
    name: "Clean Court Trainer",
    price: "$148",
    markup: "116%",
    imageUrl:
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=85&w=800",
  },
];

function MaterialIcon({
  type,
  size = 18,
}: {
  type: MaterialRow["icon"];
  size?: number;
}) {
  const color = "#4A7A28";
  const sw = 2.15;
  switch (type) {
    case "upholstery":
      return <Scissors size={size} color={color} strokeWidth={sw} />;
    case "frame":
      return <Layers2 size={size} color={color} strokeWidth={sw} />;
    case "labor":
      return <Leaf size={size} color={color} strokeWidth={sw} />;
  }
}

export default function AnalysisScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useScrollContext();

  const bottomSpacer = BOTTOM_NAV_HEIGHT + insets.bottom + 100;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => { if (router.canGoBack()) router.back(); else router.replace("/home"); }}
          hitSlop={8}
        >
          <ChevronLeft size={24} color="#1A1A1A" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>Analysis</Text>
        <Pressable style={styles.backButton} hitSlop={8}>
          <Share2 size={21} color="#1A1A1A" strokeWidth={2.25} />
        </Pressable>
      </View>

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
        {/* Hero Image */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <Image
              source={HERO_ITEM.imageUrl}
              style={styles.heroImage}
              contentFit="cover"
            />
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{HERO_ITEM.markup}</Text>
            </View>
          </View>
        </View>

        {/* Price Intelligence */}
        <View style={styles.priceCard}>
          <Text style={styles.sectionLabel}>Price Intelligence</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Retail Price</Text>
            <Text style={styles.priceRowValue}>{HERO_ITEM.retailPrice}</Text>
          </View>

          <View style={[styles.priceRow, styles.priceRowBorder]}>
            <Text style={styles.priceRowLabel}>Material Cost Est.</Text>
            <Text
              style={[styles.priceRowValue, { color: "#4A7A28" }]}
            >
              {HERO_ITEM.materialCost}
            </Text>
          </View>

          <View style={[styles.priceRow, styles.priceRowBorder]}>
            <Text style={styles.priceRowLabel}>You Would Save</Text>
            <View style={styles.savingsValue}>
              <Text style={[styles.priceRowValue, { color: "#FF6B1A" }]}>
                {HERO_ITEM.savings}
              </Text>
              <ArrowUpRight size={16} color="#FF6B1A" strokeWidth={2.4} />
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Markup Percentage</Text>
            <View style={styles.markupValue}>
              <View style={styles.overpricedBadge}>
                <Text style={styles.overpricedText}>OVERPRICED</Text>
              </View>
              <Text style={styles.priceRowValue}>
                {HERO_ITEM.markupPercent}
              </Text>
            </View>
          </View>

          <View style={styles.barSection}>
            <View style={styles.barLabels}>
              <Text style={styles.barLabelText}>Material Cost</Text>
              <Text style={styles.barLabelText}>Brand Markup</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={styles.barMaterialFill} />
              <View style={styles.barMarkupFill} />
            </View>
          </View>
        </View>

        {/* Material Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Material Breakdown</Text>
          <View style={styles.materialList}>
            {MATERIAL_ROWS.map((material) => (
              <View key={material.id} style={styles.materialRow}>
                <View style={styles.materialLeft}>
                  <View style={styles.materialIcon}>
                    <MaterialIcon type={material.icon} />
                  </View>
                  <Text style={styles.materialName}>{material.name}</Text>
                </View>
                <View style={styles.materialCostBadge}>
                  <Text style={styles.materialCostText}>{material.cost}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Where to Buy */}
        <View style={styles.section}>
          <View style={styles.whereToBuyHeader}>
            <View>
              <Text style={styles.whereToBuyTitle}>Where to Buy</Text>
              <Text style={styles.whereToBuySubtitle}>
                Cheapest sources in your region
              </Text>
            </View>
            <Pressable style={styles.regionButton}>
              <Globe size={13} color="#4A7A28" strokeWidth={2} />
              <Text style={styles.regionText}>US</Text>
            </Pressable>
          </View>

          <View style={styles.retailCard}>
            {RETAIL_SOURCES.map((source) => (
              <View key={source.id} style={styles.retailRow}>
                <View style={styles.retailInitial}>
                  <Text style={styles.retailInitialText}>{source.initial}</Text>
                </View>
                <View style={styles.retailInfo}>
                  <View style={styles.retailNameRow}>
                    <Text style={styles.retailName}>{source.name}</Text>
                    {source.isBestDeal ? (
                      <View style={styles.bestDealBadge}>
                        <Text style={styles.bestDealText}>BEST DEAL</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.retailShipping}>{source.shipping}</Text>
                </View>
                <View style={styles.retailPricing}>
                  <Text style={styles.retailPrice}>{source.price}</Text>
                  <View style={styles.retailSavingsBadge}>
                    <Text style={styles.retailSavingsText}>{source.savings}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Found Alternatives */}
        <View style={styles.section}>
          <View style={styles.alternativesHeader}>
            <Text style={styles.sectionTitle}>Found Alternatives</Text>
            <Pressable>
              <Text style={styles.seeAllLink}>See all 12</Text>
            </Pressable>
          </View>

          <View style={styles.alternativesGrid}>
            {ALTERNATIVES.map((item) => (
              <View key={item.id} style={styles.alternativeCard}>
                <View style={styles.alternativeImageWrapper}>
                  <Image
                    source={item.imageUrl}
                    style={styles.alternativeImage}
                    contentFit="cover"
                  />
                  <View style={styles.alternativeBadge}>
                    <Text style={styles.alternativeBadgeText}>
                      {item.markup}
                    </Text>
                  </View>
                </View>
                <View style={styles.alternativeBody}>
                  <Text style={styles.alternativeName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.alternativePrice}>{item.price}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA Bar */}
      <View
        style={[
          styles.ctaWrapper,
          { bottom: BOTTOM_NAV_HEIGHT + insets.bottom + 8 },
        ]}
      >
        <View style={styles.ctaBar}>
          <View style={styles.ctaRefresh}>
            <RefreshCw size={12} color="#AAAAAA" strokeWidth={2} />
            <Text style={styles.ctaRefreshText}>Prices updated 2 min ago</Text>
          </View>
          <Pressable style={styles.ctaButton} onPress={handleCopy}>
            <Copy size={15} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.ctaButtonText}>{copied ? "Copied!" : "Copy AI Search String"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    ...TypeScale.sectionLg,
    flex: 1,
    textAlign: "center",
    color: "#1A1A1A",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    width: "100%",
  },

  // Hero
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  heroCard: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 50,
    elevation: 6,
  },
  heroImage: {
    height: 272,
    width: "100%",
  },
  heroBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: "#FF6B1A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 4,
  },
  heroBadgeText: {
    ...TypeScale.bodyLg,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Price Intelligence Card
  priceCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.09,
    shadowRadius: 45,
    elevation: 4,
  },
  sectionLabel: {
    ...TypeScale.captionLg,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#AAAAAA",
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  priceRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  priceRowLabel: {
    ...TypeScale.bodyMd,
    color: "#888888",
  },
  priceRowValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
    letterSpacing: -0.44,
    color: "#1A1A1A",
  },
  savingsValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  markupValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  overpricedBadge: {
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  overpricedText: {
    ...TypeScale.captionXs,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  barSection: {
    marginTop: 20,
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  barLabelText: {
    ...TypeScale.captionSm,
    fontWeight: "400",
    color: "#888888",
  },
  barTrack: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F0F0F0",
    marginTop: 8,
    overflow: "hidden",
  },
  barMaterialFill: {
    width: "19%",
    height: "100%",
    backgroundColor: "#4A7A28",
    borderRadius: 4,
  },
  barMarkupFill: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FF6B1A",
  },

  // Material Breakdown
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...TypeScale.sectionMd,
    color: "#1A1A1A",
  },
  materialList: {
    marginTop: 16,
    gap: 12,
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  materialLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
    minWidth: 0,
  },
  materialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF4E9",
    alignItems: "center",
    justifyContent: "center",
  },
  materialName: {
    ...TypeScale.bodyMd,
    flex: 1,
    color: "#1A1A1A",
  },
  materialCostBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  materialCostText: {
    ...TypeScale.captionLg,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  // Where to Buy
  whereToBuyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  whereToBuyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.4,
    color: "#1A1A1A",
  },
  whereToBuySubtitle: {
    ...TypeScale.captionLg,
    fontWeight: "400",
    color: "#888888",
    marginTop: 4,
  },
  regionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#4A7A28",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  regionText: {
    ...TypeScale.captionMd,
    fontWeight: "500",
    color: "#4A7A28",
  },
  retailCard: {
    marginTop: 16,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.09,
    shadowRadius: 45,
    elevation: 4,
    overflow: "hidden",
  },
  retailRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 68,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  retailInitial: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  retailInitialText: {
    ...TypeScale.bodyMd,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  retailInfo: {
    flex: 1,
    minWidth: 0,
  },
  retailNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retailName: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  bestDealBadge: {
    backgroundColor: "#1C2A0E",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  bestDealText: {
    ...TypeScale.captionXs,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  retailShipping: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "#888888",
    marginTop: 2,
  },
  retailPricing: {
    alignItems: "flex-end",
  },
  retailPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: -0.36,
    color: "#4A7A28",
  },
  retailSavingsBadge: {
    backgroundColor: "#F0F6E8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
  },
  retailSavingsText: {
    ...TypeScale.captionXs,
    fontWeight: "600",
    color: "#4A7A28",
  },

  // Alternatives
  alternativesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAllLink: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#FF6B1A",
  },
  alternativesGrid: {
    marginTop: 16,
    flexDirection: "row",
    gap: 14,
  },
  alternativeCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#1C2A0E",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 36,
    elevation: 3,
  },
  alternativeImageWrapper: {
    position: "relative",
    backgroundColor: "#F5F5F5",
  },
  alternativeImage: {
    height: 138,
    width: "100%",
  },
  alternativeBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#FF6B1A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 4,
  },
  alternativeBadgeText: {
    ...TypeScale.captionSm,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  alternativeBody: {
    padding: 14,
  },
  alternativeName: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    letterSpacing: -0.4,
    color: "#1A1A1A",
    minHeight: 40,
  },
  alternativePrice: {
    ...TypeScale.bodyLg,
    fontWeight: "700",
    color: "#4A7A28",
    marginTop: 8,
  },

  // CTA Bar
  ctaWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 40,
  },
  ctaBar: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 42,
    elevation: 6,
  },
  ctaRefresh: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ctaRefreshText: {
    ...TypeScale.captionSm,
    fontWeight: "400",
    color: "#AAAAAA",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1C2A0E",
    marginTop: 8,
    shadowColor: "#1C2A0E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 4,
  },
  ctaButtonText: {
    ...TypeScale.captionLg,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
