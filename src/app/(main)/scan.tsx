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
import { ArrowLeft, Camera, Image as ImageIcon } from "lucide-react-native";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

interface RecentScan {
  id: string;
  image: string;
  name: string;
  markup: string;
}

const RECENT_SCANS: RecentScan[] = [
  {
    id: "running-sneaker",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    name: "Running sneaker",
    markup: "+34%",
  },
  {
    id: "leather-handbag",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop",
    name: "Leather handbag",
    markup: "+21%",
  },
  {
    id: "wool-jacket",
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=400&auto=format&fit=crop",
    name: "Wool jacket",
    markup: "+48%",
  },
];

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={22} color="#1A1A1A" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>Scan Item</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.viewfinderWrapper}>
          <View style={styles.viewfinder}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            <View style={styles.viewfinderContent}>
              <Camera size={48} color="#CCCCCC" strokeWidth={1.6} />
              <Text style={styles.viewfinderPrimary}>
                Point at any product
              </Text>
              <Text style={styles.viewfinderSecondary}>
                Sneakers, bags, electronics, home goods — anything.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.scanButton} onPress={() => router.push("/analysis")}>
            <Text style={styles.scanButtonText}>Scan for Arbitrage</Text>
          </Pressable>
          <Pressable style={styles.uploadButton} onPress={() => router.push("/analysis")}>
            <ImageIcon size={16} color="#FF6B1A" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Upload from gallery</Text>
          </Pressable>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Scans</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentScrollContent}
          >
            {RECENT_SCANS.map((scan) => (
              <Pressable key={scan.id} style={styles.recentCard} onPress={() => router.push("/analysis")}>
                <Image
                  source={scan.image}
                  style={styles.recentImage}
                  contentFit="cover"
                />
                <View style={styles.recentBadge}>
                  <Text style={styles.recentBadgeText}>{scan.markup}</Text>
                </View>
                </Pressable>
            ))}
          </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  viewfinderWrapper: {
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    width: "100%",
  },
  viewfinder: {
    aspectRatio: 1,
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#DDDDDD",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 48,
    height: 48,
  },
  cornerTL: {
    top: 20,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#4A7A28",
    borderTopLeftRadius: 18,
  },
  cornerTR: {
    top: 20,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#4A7A28",
    borderTopRightRadius: 18,
  },
  cornerBL: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#4A7A28",
    borderBottomLeftRadius: 18,
  },
  cornerBR: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#4A7A28",
    borderBottomRightRadius: 18,
  },
  viewfinderContent: {
    alignItems: "center",
    gap: 6,
  },
  viewfinderPrimary: {
    ...TypeScale.muted,
    color: "#AAAAAA",
  },
  viewfinderSecondary: {
    ...TypeScale.mutedSm,
    color: "#BBBBBB",
    textAlign: "center",
  },
  actions: {
    marginTop: 28,
    gap: 16,
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    width: "100%",
  },
  scanButton: {
    height: 56,
    borderRadius: 50,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  scanButtonText: {
    ...TypeScale.bodyLg,
    color: "#FFFFFF",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    alignSelf: "center",
  },
  uploadButtonText: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#FF6B1A",
  },
  recentSection: {
    marginTop: 40,
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    width: "100%",
  },
  recentTitle: {
    ...TypeScale.sectionMd,
    color: "#1A1A1A",
  },
  recentScrollContent: {
    marginTop: 16,
    gap: 12,
    paddingBottom: 8,
  },
  recentCard: {
    width: 112,
    height: 112,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  recentImage: {
    width: "100%",
    height: "100%",
  },
  recentBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#FF6B1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#FF6B1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 4,
  },
  recentBadgeText: {
    ...TypeScale.captionXs,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
