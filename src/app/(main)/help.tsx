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
  ChevronLeft,
  ChevronDown,
  MessageCircle,
  Mail,
  FileText,
} from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does Fringe detect markups?",
    answer: "Fringe scans product details and compares retail prices against estimated manufacturing costs, material quality, and brand premiums to calculate a markup percentage.",
  },
  {
    question: "What is Fringe Pro?",
    answer: "Fringe Pro gives you unlimited scans, full markup breakdowns, price drop alerts, and AI-powered search strings to find unbranded alternatives.",
  },
  {
    question: "How do price drop alerts work?",
    answer: "When you save an item, Fringe monitors its price across retailers and notifies you when there's a significant drop or when alternatives become cheaper.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your Fringe Pro subscription at any time. Your access will continue until the end of your current billing period.",
  },
];

export default function HelpScreen() {
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
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Contact Options */}
        <View style={styles.contactRow}>
          <Pressable style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: "#F0F6E8" }]}>
              <MessageCircle size={22} color="#4A7A28" strokeWidth={2} />
            </View>
            <Text style={styles.contactLabel}>Live Chat</Text>
          </Pressable>
          <Pressable style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: "#FFF0E6" }]}>
              <Mail size={22} color="#FF6B1A" strokeWidth={2} />
            </View>
            <Text style={styles.contactLabel}>Email Us</Text>
          </Pressable>
          <Pressable style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: "#F5F5F5" }]}>
              <FileText size={22} color="#888888" strokeWidth={2} />
            </View>
            <Text style={styles.contactLabel}>Guides</Text>
          </Pressable>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FREQUENTLY ASKED</Text>
          <View style={styles.faqCard}>
            {FAQ_DATA.map((item, index) => (
              <Pressable
                key={item.question}
                style={[
                  styles.faqRow,
                  index < FAQ_DATA.length - 1 && styles.faqRowBorder,
                ]}
              >
                <View style={styles.faqContent}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
                <ChevronDown size={18} color="#C4C4C4" strokeWidth={2} />
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

  // Contact
  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  contactCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  contactLabel: {
    ...TypeScale.captionMd,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  // FAQ
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...TypeScale.captionLg,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#888888",
    marginBottom: 12,
  },
  faqCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 3,
    overflow: "hidden",
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  faqRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  faqContent: {
    flex: 1,
    marginRight: 8,
  },
  faqQuestion: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  faqAnswer: {
    ...TypeScale.captionMd,
    fontWeight: "400",
    color: "#888888",
    marginTop: 6,
    lineHeight: 18,
  },
});
