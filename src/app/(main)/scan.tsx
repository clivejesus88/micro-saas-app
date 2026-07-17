import { useState, useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";
import {
  ArrowLeft,
  Zap,
  ZapOff,
  ImageIcon,
  Lock,
  Unlock,
  Layers,
} from "lucide-react-native";
import { TypeScale } from "@/constants/typography";

type ScanState = "idle" | "detected" | "analyzing";

interface DetectedProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  salesRank: number;
  isGated: boolean;
  retailPrice: number;
}

const MOCK_PRODUCTS: DetectedProduct[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High OG",
    category: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=200&h=200",
    salesRank: 342,
    isGated: false,
    retailPrice: 180,
  },
  {
    id: "2",
    name: "Gucci GG Canvas Tote",
    category: "Bags",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200&h=200",
    salesRank: 87,
    isGated: true,
    retailPrice: 1200,
  },
  {
    id: "3",
    name: "Dyson Airwrap Complete",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=200&h=200",
    salesRank: 1203,
    isGated: false,
    retailPrice: 599,
  },
  {
    id: "4",
    name: "Levi's 501 Original Fit",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200&h=200",
    salesRank: 2156,
    isGated: false,
    retailPrice: 89,
  },
  {
    id: "5",
    name: "Le Creuset Dutch Oven 5.5qt",
    category: "Home",
    image:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=200&h=200",
    salesRank: 567,
    isGated: true,
    retailPrice: 420,
  },
  {
    id: "6",
    name: "Ray-Ban Aviator Classic",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=200&h=200",
    salesRank: 934,
    isGated: false,
    retailPrice: 210,
  },
];

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [torchOn, setTorchOn] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [detectedProduct, setDetectedProduct] =
    useState<DetectedProduct | null>(null);
  const [scannedCount, setScannedCount] = useState(0);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(
    null,
  );

  const scanLineY = useSharedValue(0);
  const scanLineActive = useSharedValue(0);
  const cardTranslateY = useSharedValue(120);
  const cardOpacity = useSharedValue(0);
  const cornerScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (scanState === "idle") {
      scanLineActive.value = 1;
      scanLineY.value = 0;
      scanLineY.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: 1600,
            easing: Easing.inOut(Easing.cubic),
          }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      );
    } else {
      scanLineActive.value = 0;
      cancelAnimation(scanLineY);
    }

    return () => {
      cancelAnimation(scanLineY);
    };
  }, [scanState]);

  useEffect(() => {
    if (scanState === "detected") {
      cardTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 140,
        mass: 0.7,
      });
      cardOpacity.value = withTiming(1, { duration: 250 });
      cornerScale.value = withSpring(1.08, {
        damping: 8,
        stiffness: 200,
      });
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 600 }),
          withTiming(0.3, { duration: 600 }),
        ),
        -1,
        false,
      );
    } else {
      cardTranslateY.value = withTiming(120, { duration: 200 });
      cardOpacity.value = withTiming(0, { duration: 150 });
      cornerScale.value = withTiming(1, { duration: 200 });
      cancelAnimation(pulseOpacity);
      pulseOpacity.value = 0.3;
    }

    return () => {
      cancelAnimation(cardTranslateY);
      cancelAnimation(cardOpacity);
      cancelAnimation(cornerScale);
      cancelAnimation(pulseOpacity);
    };
  }, [scanState]);

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${interpolate(scanLineY.value, [0, 1], [8, 92])}%`,
    opacity: scanLineActive.value,
  }));

  const cornersStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cornerScale.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: `${cardTranslateY.value}%` }],
    opacity: cardOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const handleBarcodeScanned = useCallback(
    (scanningResult: { type: string; data: string }) => {
      if (scanState !== "idle") return;
      if (scanningResult.data === lastScannedBarcode) return;

      setLastScannedBarcode(scanningResult.data);
      const product =
        MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
      setDetectedProduct(product);
      setScanState("detected");
    },
    [scanState, lastScannedBarcode],
  );

  const handleCardTap = useCallback(() => {
    if (!detectedProduct) return;
    setScanState("analyzing");
    setScannedCount((c) => c + 1);
    setTimeout(() => {
      if (batchMode) {
        setDetectedProduct(null);
        setLastScannedBarcode(null);
        setScanState("idle");
      } else {
        setScanState("idle");
        setDetectedProduct(null);
        setLastScannedBarcode(null);
        router.push("/analysis");
      }
    }, 1800);
  }, [detectedProduct, batchMode, router]);

  const handleDismissCard = useCallback(() => {
    setDetectedProduct(null);
    setLastScannedBarcode(null);
    setScanState("idle");
  }, []);

  const toggleTorch = useCallback(() => {
    setTorchOn((prev) => !prev);
  }, []);

  const toggleBatch = useCallback(() => {
    setBatchMode((prev) => !prev);
  }, []);

  const pickFromGallery = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]) {
        setScanState("analyzing");
        setTimeout(() => {
          setScanState("idle");
          router.push("/analysis");
        }, 2000);
      }
    } catch {
      setScanState("idle");
    }
  }, [router]);

  const handleBack = useCallback(() => {
    if (scanState === "detected") {
      handleDismissCard();
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace("/home");
  }, [scanState, handleDismissCard, router]);

  if (!permission) {
    return <View style={styles.root} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={[styles.permissionInner, { paddingTop: insets.top + 40 }]}>
          <View style={styles.permissionIconWrap}>
            <CameraViewIcon />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDesc}>
            Fringe needs your camera to scan barcodes and analyze product prices
            in real time.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.permissionButton,
              pressed && { opacity: 0.88 },
            ]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Enable Camera</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.permissionGalleryBtn,
              pressed && { opacity: 0.6 },
            ]}
            onPress={pickFromGallery}
          >
            <ImageIcon size={16} color="#FF6B1A" strokeWidth={2} />
            <Text style={styles.permissionGalleryText}>Upload from gallery</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: [
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code128",
            "code39",
            "code93",
            "itf14",
            "qr",
          ],
        }}
        onBarcodeScanned={scanState === "idle" ? handleBarcodeScanned : undefined}
      />

      <View style={styles.overlay}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable style={styles.headerBtn} onPress={handleBack} hitSlop={8}>
            <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.headerTitle}>Sourcing Engine</Text>
          <Pressable
            style={styles.headerBtn}
            onPress={toggleTorch}
            hitSlop={8}
          >
            <View style={styles.torchBtn}>
              {torchOn ? (
                <Zap size={20} color="#FFD60A" strokeWidth={2.2} />
              ) : (
                <ZapOff size={20} color="#FFFFFF" strokeWidth={2.2} />
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.viewfinderArea}>
          <Animated.View style={[styles.boundingBox, cornersStyle]}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
            <Animated.View style={[styles.pulseRing, pulseStyle]} />
          </Animated.View>

          {scanState === "idle" && (
            <Text style={styles.hintText}>Align barcode within the frame</Text>
          )}

          {scanState === "analyzing" && (
            <View style={styles.analyzingWrap}>
              <View style={styles.analyzingPill}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.analyzingText}>Analyzing...</Text>
              </View>
            </View>
          )}
        </View>

        <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 16 }]}>
          {scanState === "idle" && (
            <>
              <Pressable
                style={styles.batchToggle}
                onPress={toggleBatch}
              >
                <Layers size={14} color={batchMode ? "#4AE88C" : "#AAAAAA"} strokeWidth={2} />
                <Text
                  style={[
                    styles.batchLabel,
                    batchMode && styles.batchLabelActive,
                  ]}
                >
                  Batch Mode
                </Text>
                <View
                  style={[
                    styles.batchTrack,
                    batchMode && styles.batchTrackActive,
                  ]}
                >
                  <View
                    style={[
                      styles.batchDot,
                      batchMode && styles.batchDotActive,
                    ]}
                  />
                </View>
              </Pressable>

              {batchMode && scannedCount > 0 && (
                <Text style={styles.batchCount}>
                  {scannedCount} item{scannedCount !== 1 ? "s" : ""} scanned
                </Text>
              )}

              <Pressable
                style={styles.galleryBtn}
                onPress={pickFromGallery}
              >
                <ImageIcon size={18} color="#FFFFFF" strokeWidth={2} />
              </Pressable>
            </>
          )}

          {scanState === "detected" && detectedProduct && (
            <Animated.View style={[styles.slideUpCard, cardStyle]}>
              <Pressable
                style={({ pressed }) => [
                  styles.cardContent,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleCardTap}
              >
                <View style={styles.cardImageWrap}>
                  <Animated.Image
                    source={{ uri: detectedProduct.image }}
                    style={styles.cardImage}
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardCategory} numberOfLines={1}>
                    {detectedProduct.category}
                  </Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {detectedProduct.name}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardRank}>
                      Rank #{detectedProduct.salesRank.toLocaleString()}
                    </Text>
                    <View
                      style={[
                        styles.gatedBadge,
                        detectedProduct.isGated
                          ? styles.gatedBadgeRed
                          : styles.gatedBadgeGreen,
                      ]}
                    >
                      {detectedProduct.isGated ? (
                        <Lock size={11} color="#FFFFFF" strokeWidth={2.5} />
                      ) : (
                        <Unlock size={11} color="#FFFFFF" strokeWidth={2.5} />
                      )}
                      <Text style={styles.gatedText}>
                        {detectedProduct.isGated ? "Gated" : "Ungated"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardChevron}>
                  <Text style={styles.chevronText}>›</Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.cardDismiss}
                onPress={handleDismissCard}
                hitSlop={8}
              >
                <Text style={styles.cardDismissText}>Dismiss</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

function CameraViewIcon() {
  return (
    <View style={{ width: 64, height: 64, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: "#4AE88C",
          borderStyle: "dashed",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ position: "absolute", top: -1, left: -1, width: 14, height: 14, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "#4AE88C", borderTopLeftRadius: 6 }} />
        <View style={{ position: "absolute", top: -1, right: -1, width: 14, height: 14, borderTopWidth: 3, borderRightWidth: 3, borderColor: "#4AE88C", borderTopRightRadius: 6 }} />
        <View style={{ position: "absolute", bottom: -1, left: -1, width: 14, height: 14, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "#4AE88C", borderBottomLeftRadius: 6 }} />
        <View style={{ position: "absolute", bottom: -1, right: -1, width: 14, height: 14, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "#4AE88C", borderBottomRightRadius: 6 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  headerTitle: {
    ...TypeScale.sectionLg,
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
  },
  torchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  viewfinderArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  boundingBox: {
    width: 260,
    height: 260,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 36,
    height: 36,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: "absolute",
    left: "10%",
    right: "10%",
    height: 2,
    backgroundColor: "#4AE88C",
    borderRadius: 1,
    shadowColor: "#4AE88C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  pulseRing: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#4AE88C",
  },
  hintText: {
    ...TypeScale.captionLg,
    color: "rgba(255,255,255,0.7)",
    marginTop: 24,
    textAlign: "center",
  },
  analyzingWrap: {
    marginTop: 24,
    alignItems: "center",
  },
  analyzingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(28,42,14,0.88)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
  },
  analyzingText: {
    ...TypeScale.bodyLg,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bottomArea: {
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  batchToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
  },
  batchLabel: {
    ...TypeScale.captionMd,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  batchLabelActive: {
    color: "#4AE88C",
  },
  batchTrack: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  batchTrackActive: {
    backgroundColor: "#4AE88C",
  },
  batchDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  batchDotActive: {
    alignSelf: "flex-end",
  },
  batchCount: {
    ...TypeScale.captionSm,
    color: "#4AE88C",
    fontWeight: "500",
  },
  galleryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  slideUpCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  cardImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F0F0F3",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardCategory: {
    ...TypeScale.captionSm,
    color: "#888888",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    ...TypeScale.bodyLg,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  cardRank: {
    ...TypeScale.captionMd,
    color: "#666666",
    fontWeight: "500",
  },
  gatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gatedBadgeGreen: {
    backgroundColor: "#2D8A4E",
  },
  gatedBadgeRed: {
    backgroundColor: "#DC2626",
  },
  gatedText: {
    ...TypeScale.captionXs,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  cardChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F3",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronText: {
    fontSize: 22,
    color: "#999999",
    fontWeight: "300",
    marginTop: -2,
  },
  cardDismiss: {
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  cardDismissText: {
    ...TypeScale.captionMd,
    color: "#999999",
    fontWeight: "500",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  permissionInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionIconWrap: {
    marginBottom: 8,
  },
  permissionTitle: {
    ...TypeScale.headingMd,
    color: "#FFFFFF",
    textAlign: "center",
  },
  permissionDesc: {
    ...TypeScale.bodyMd,
    color: "#888888",
    textAlign: "center",
    lineHeight: 22,
  },
  permissionButton: {
    width: "100%",
    height: 52,
    borderRadius: 50,
    backgroundColor: "#4AE88C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  permissionButtonText: {
    ...TypeScale.bodyLg,
    color: "#0A0A0A",
    fontWeight: "700",
  },
  permissionGalleryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  permissionGalleryText: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#FF6B1A",
  },
});
