import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Camera,
  Check,
  Image as ImageIcon,
  X,
  Sparkles,
} from "lucide-react-native";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

type ScanState = "idle" | "preview" | "analyzing";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = useCallback(async (useCamera: boolean) => {
    try {
      const launcher = useCamera
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

      const result = await launcher({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setScanState("preview");
      }
    } catch {
      setScanState("idle");
    }
  }, []);

  const handleAnalyze = useCallback(() => {
    setScanState("analyzing");
    setTimeout(() => {
      setScanState("idle");
      setImageUri(null);
      router.push("/analysis");
    }, 2200);
  }, [router]);

  const handleClear = useCallback(() => {
    setImageUri(null);
    setScanState("idle");
  }, []);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            if (scanState !== "idle") {
              handleClear();
              return;
            }
            if (router.canGoBack()) router.back();
            else router.replace("/home");
          }}
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
            {scanState === "idle" && (
              <>
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
              </>
            )}

            {scanState === "preview" && imageUri && (
              <>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
                <Pressable
                  style={styles.clearButton}
                  onPress={handleClear}
                  hitSlop={8}
                >
                  <View style={styles.clearButtonBg}>
                    <X size={16} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                </Pressable>
              </>
            )}

            {scanState === "analyzing" && (
              <>
                {imageUri && (
                  <Image
                    source={{ uri: imageUri }}
                    style={[styles.previewImage, { opacity: 0.4 }]}
                    contentFit="cover"
                  />
                )}
                <View style={styles.analyzingOverlay}>
                  <View style={styles.analyzingPill}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.analyzingText}>Analyzing...</Text>
                  </View>
                  <Text style={styles.analyzingHint}>
                    Scanning prices across 50+ retailers
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {scanState === "idle" && (
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.scanButton,
                pressed && { opacity: 0.88 },
              ]}
              onPress={() => pickImage(true)}
            >
              <Camera size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.scanButtonText}>Scan for Arbitrage</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.uploadButton,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => pickImage(false)}
            >
              <ImageIcon size={16} color="#FF6B1A" strokeWidth={2} />
              <Text style={styles.uploadButtonText}>Upload from gallery</Text>
            </Pressable>
          </View>
        )}

        {scanState === "preview" && (
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.scanButton,
                pressed && { opacity: 0.88 },
              ]}
              onPress={handleAnalyze}
            >
              <Sparkles size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.scanButtonText}>Analyze Product</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.uploadButton,
                pressed && { opacity: 0.6 },
              ]}
              onPress={handleClear}
            >
              <Text style={styles.uploadButtonText}>Choose different photo</Text>
            </Pressable>
          </View>
        )}

        {scanState === "idle" && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent Scans</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No scans yet</Text>
              <Text style={styles.emptyDesc}>
                Your recent scans will appear here
              </Text>
            </View>
          </View>
        )}
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
  previewImage: {
    width: "100%",
    height: "100%",
  },
  clearButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  clearButtonBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  analyzingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(28,42,14,0.85)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
  },
  analyzingText: {
    ...TypeScale.bodyLg,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  analyzingHint: {
    ...TypeScale.mutedSm,
    color: "rgba(255,255,255,0.7)",
  },
  actions: {
    marginTop: 28,
    gap: 16,
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    width: "100%",
  },
  scanButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 50,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
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
});
