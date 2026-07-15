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
  ChartBar,
  ChevronLeft,
  Bell,
  Crown,
  ScanLine,
  Sparkles,
} from "lucide-react-native";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    id: "unlimited-scans",
    icon: ScanLine,
    title: "Unlimited Scans",
    description: "Scan any product, anytime.",
  },
  {
    id: "full-breakdown",
    icon: ChartBar,
    title: "Full Markup Breakdown",
    description: "See exact material costs vs retail price.",
  },
  {
    id: "price-drop-alerts",
    icon: Bell,
    title: "Price Drop Alerts",
    description: "Get notified when alternatives drop.",
  },
  {
    id: "ai-search-strings",
    icon: Sparkles,
    title: "AI Search Strings",
    description: "Find unbranded dupes anywhere.",
  },
];

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    "annual"
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => { if (router.canGoBack()) router.back(); else router.replace("/login"); }}
          hitSlop={8}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </Pressable>

        <Crown size={40} color="#FF6B1A" strokeWidth={2.1} />
        <Text style={styles.headerTitle}>Fringe Pro</Text>
        <Text style={styles.headerTagline}>
          Unlock your arbitrage advantage.
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentInner,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <View key={feature.id} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Icon size={20} color="#4A7A28" strokeWidth={2.2} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Plan Selection */}
        <Text style={styles.planHeading}>Choose Your Plan</Text>
        <View style={styles.planRow}>
          <Pressable
            style={[
              styles.planCard,
              selectedPlan === "monthly" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <Text
              style={[
                styles.planLabel,
                selectedPlan === "monthly" && styles.planLabelActive,
              ]}
            >
              Monthly
            </Text>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>$9.99</Text>
              <Text style={styles.planPeriod}>/mo</Text>
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.planCard,
              selectedPlan === "annual" && styles.planCardBestSelected,
            ]}
            onPress={() => setSelectedPlan("annual")}
          >
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>Best Value</Text>
            </View>
            <Text
              style={[
                styles.planLabel,
                selectedPlan === "annual" && styles.planLabelGreen,
              ]}
            >
              Annual
            </Text>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>$59.99</Text>
              <Text style={styles.planPeriod}>/yr</Text>
            </View>
            <Text style={styles.planSavings}>$5/mo · Save 50%</Text>
          </Pressable>
        </View>

        {/* CTA */}
        <Pressable style={styles.ctaButton} onPress={() => router.replace("/home")}>
          <Text style={styles.ctaText}>Start Free 7-Day Trial</Text>
        </Pressable>

        <Text style={styles.legalText}>
          No charge until trial ends. Cancel anytime.
        </Text>

        <Pressable style={styles.restoreButton} onPress={() => router.replace("/home")}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    backgroundColor: "#1C2A0E",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 34,
    letterSpacing: -0.9,
    color: "#FFFFFF",
    marginTop: 12,
  },
  headerTagline: {
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },

  // Content
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  // Features
  features: {
    gap: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F6E8",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...TypeScale.sectionMd,
    color: "#1A1A1A",
  },
  featureDesc: {
    ...TypeScale.captionLg,
    fontWeight: "400",
    color: "#888888",
    marginTop: 2,
  },

  // Plans
  planHeading: {
    ...TypeScale.sectionMd,
    color: "#1A1A1A",
    marginTop: 32,
    marginBottom: 16,
  },
  planRow: {
    flexDirection: "row",
    gap: 12,
  },
  planCard: {
    flex: 1,
    minHeight: 124,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
    padding: 16,
    justifyContent: "center",
  },
  planCardSelected: {
    borderColor: "#4A7A28",
    borderWidth: 2,
  },
  planCardBest: {
    borderColor: "#4A7A28",
    borderWidth: 2,
  },
  planCardBestSelected: {
    borderColor: "#4A7A28",
    borderWidth: 2,
  },
  bestValueBadge: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    backgroundColor: "#4A7A28",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    ...TypeScale.captionXs,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  planLabel: {
    ...TypeScale.captionMd,
    fontWeight: "500",
    color: "#888888",
  },
  planLabelActive: {
    color: "#1A1A1A",
  },
  planLabelGreen: {
    color: "#4A7A28",
  },
  planPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 8,
  },
  planPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: -0.78,
    color: "#1A1A1A",
  },
  planPeriod: {
    ...TypeScale.captionLg,
    fontWeight: "400",
    color: "#888888",
  },
  planSavings: {
    ...TypeScale.captionMd,
    fontWeight: "500",
    color: "#FF6B1A",
    marginTop: 4,
  },

  // CTA
  ctaButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  ctaText: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  legalText: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 12,
  },
  restoreButton: {
    alignItems: "center",
    marginTop: 12,
  },
  restoreText: {
    ...TypeScale.captionLg,
    fontWeight: "500",
    color: "#4A7A28",
    textDecorationLine: "underline",
  },
});
