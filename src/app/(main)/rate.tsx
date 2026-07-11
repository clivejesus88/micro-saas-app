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
import { ChevronLeft, Star, Send } from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

export default function RateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [rating, setRating] = useState(0);
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
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.headerTitle}>Rate Fringe</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>⭐</Text>
          <Text style={styles.heroTitle}>Enjoying Fringe?</Text>
          <Text style={styles.heroSubtitle}>
            Your rating helps us improve and reach more smart shoppers.
          </Text>
        </View>

        {/* Star Rating */}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              style={styles.starButton}
              onPress={() => setRating(star)}
            >
              <Star
                size={44}
                color={star <= rating ? "#FF6B1A" : "#E0E0E0"}
                strokeWidth={2}
                fill={star <= rating ? "#FF6B1A" : "transparent"}
              />
            </Pressable>
          ))}
        </View>

        {rating > 0 && (
          <Text style={styles.ratingLabel}>
            {rating === 5
              ? "Love it!"
              : rating === 4
                ? "Great!"
                : rating === 3
                  ? "It's okay"
                  : rating === 2
                    ? "Could be better"
                    : "Not great"}
          </Text>
        )}

        {/* Submit */}
        <View style={styles.submitWrapper}>
          <Pressable
            style={[
              styles.submitButton,
              rating === 0 && styles.submitButtonDisabled,
            ]}
            disabled={rating === 0}
          >
            <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.submitText}>Submit Rating</Text>
          </Pressable>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: -0.4,
    color: "#1A1A1A",
  },

  // Hero
  heroSection: {
    alignItems: "center",
    marginTop: 48,
    paddingHorizontal: 40,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.72,
    color: "#1A1A1A",
    textAlign: "center",
  },
  heroSubtitle: {
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "#888888",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  // Stars
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 40,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FF6B1A",
    textAlign: "center",
    marginTop: 16,
  },

  // Submit
  submitWrapper: {
    paddingHorizontal: 20,
    marginTop: 48,
  },
  submitButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1C2A0E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitText: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
