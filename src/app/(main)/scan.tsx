import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Zap,
  ZapOff,
  ImageIcon,
  Lock,
  Layers,
  ScanLine,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  BadgeCheck,
  CircleDollarSign,
} from "lucide-react-native";
import { TypeScale } from "@/constants/typography";

type ScanState = "idle" | "detected" | "analyzing";

interface DetectedProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  salesRank: number;
  salesRankPercent: number;
  isGated: boolean;
  ipRisk: boolean;
  retailPrice: number;
  materialCost: number;
}

const MOCK_PRODUCTS: DetectedProduct[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High OG",
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=400&h=400",
    salesRank: 342,
    salesRankPercent: 0.2,
    isGated: false,
    ipRisk: true,
    retailPrice: 180,
    materialCost: 28,
  },
  {
    id: "2",
    name: "Gucci GG Canvas Tote Bag",
    category: "Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400&h=400",
    salesRank: 87,
    salesRankPercent: 0.05,
    isGated: true,
    ipRisk: true,
    retailPrice: 1200,
    materialCost: 150,
  },
  {
    id: "3",
    name: "Dyson Airwrap Complete",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=400&h=400",
    salesRank: 1203,
    salesRankPercent: 1.2,
    isGated: false,
    ipRisk: false,
    retailPrice: 599,
    materialCost: 219,
  },
  {
    id: "4",
    name: "Levi's 501 Original Fit Jeans",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400&h=400",
    salesRank: 2156,
    salesRankPercent: 2.8,
    isGated: false,
    ipRisk: false,
    retailPrice: 89,
    materialCost: 12,
  },
  {
    id: "5",
    name: "Le Creuset Dutch Oven 5.5qt",
    category: "Home",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400&h=400",
    salesRank: 567,
    salesRankPercent: 0.4,
    isGated: true,
    ipRisk: false,
    retailPrice: 420,
    materialCost: 102,
  },
  {
    id: "6",
    name: "Ray-Ban Aviator Classic",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400&h=400",
    salesRank: 934,
    salesRankPercent: 0.8,
    isGated: false,
    ipRisk: false,
    retailPrice: 210,
    materialCost: 42,
  },
];

function formatSalesRankPercent(pct: number): string {
  if (pct < 0.01) return "Top 0.01%";
  if (pct < 1) return `Top ${pct.toFixed(1)}%`;
  return `Top ${Math.round(pct)}%`;
}

function triggerHaptic(isHighProfit: boolean) {
  try {
    if (isHighProfit) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 120);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {}
}

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const costInputRef = useRef<TextInput>(null);

  const [scanState, setScanState] = useState<ScanState>("idle");
  const [torchOn, setTorchOn] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [detectedProduct, setDetectedProduct] = useState<DetectedProduct | null>(null);
  const [scannedCount, setScannedCount] = useState(0);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const [buyCost, setBuyCost] = useState("");
  const [costFocused, setCostFocused] = useState(false);

  const scanLineY = useSharedValue(0);
  const scanLineActive = useSharedValue(0);
  const cardTranslateY = useSharedValue(100);
  const cardOpacity = useSharedValue(0);
  const cornerScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);
  const gridOpacity = useSharedValue(0.08);

  const computedBuyCost = useMemo(() => {
    const val = parseFloat(buyCost);
    return isNaN(val) ? 0 : val;
  }, [buyCost]);

  const netProfit = useMemo(() => {
    if (!detectedProduct || computedBuyCost <= 0) return 0;
    return detectedProduct.retailPrice - computedBuyCost;
  }, [detectedProduct, computedBuyCost]);

  const roi = useMemo(() => {
    if (computedBuyCost <= 0) return 0;
    return (netProfit / computedBuyCost) * 100;
  }, [netProfit, computedBuyCost]);

  const scanStateSv = useSharedValue<ScanState>("idle");

  useEffect(() => {
    scanStateSv.value = scanState;
  }, [scanState, scanStateSv]);

  useAnimatedReaction(
    () => scanStateSv.value,
    (state) => {
      if (state === "idle") {
        scanLineActive.value = 1;
        scanLineY.value = 0;
        scanLineY.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.cubic) }),
            withTiming(0, { duration: 0 }),
          ),
          -1,
          false,
        );
        gridOpacity.value = withTiming(0.08, { duration: 400 });
      } else {
        scanLineActive.value = 0;
        cancelAnimation(scanLineY);
        gridOpacity.value = withTiming(0, { duration: 200 });
      }
    },
  );

  useAnimatedReaction(
    () => scanStateSv.value,
    (state) => {
      if (state === "detected") {
        cardTranslateY.value = withSpring(0, { damping: 18, stiffness: 100, mass: 0.8 });
        cardOpacity.value = withTiming(1, { duration: 350 });
        cornerScale.value = withSpring(1.05, { damping: 10, stiffness: 180 });
        pulseOpacity.value = withRepeat(
          withSequence(withTiming(0.7, { duration: 700 }), withTiming(0.25, { duration: 700 })),
          -1, false,
        );
      } else {
        cardTranslateY.value = withTiming(100, { duration: 250 });
        cardOpacity.value = withTiming(0, { duration: 200 });
        cornerScale.value = withTiming(1, { duration: 250 });
        cancelAnimation(pulseOpacity);
        pulseOpacity.value = 0.3;
      }
    },
  );

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${interpolate(scanLineY.value, [0, 1], [6, 94])}%`,
    opacity: scanLineActive.value,
  }));
  const cornersStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cornerScale.value }],
  }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: `${cardTranslateY.value}%` }],
    opacity: cardOpacity.value,
  }));
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));
  const gridStyle = useAnimatedStyle(() => ({ opacity: gridOpacity.value }));

  const dismissCard = useCallback(() => {
    Keyboard.dismiss();
    setDetectedProduct(null);
    setLastScannedBarcode(null);
    setBuyCost("");
    setCostFocused(false);
    setScanState("idle");
  }, []);

  const swipeDown = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        cardTranslateY.value = interpolate(e.translationY, [0, 200], [0, 50], { extrapolateRight: "clamp" });
        cardOpacity.value = interpolate(e.translationY, [0, 200], [1, 0.3], { extrapolateRight: "clamp" });
      }
    })
    .onEnd((e) => {
      if (e.translationY > 80 || e.velocityY > 500) {
        runOnJS(dismissCard)();
      } else {
        cardTranslateY.value = withSpring(0, { damping: 18, stiffness: 100 });
        cardOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  const handleBarcodeScanned = useCallback(
    (scanningResult: { type: string; data: string }) => {
      if (scanState !== "idle") return;
      if (scanningResult.data === lastScannedBarcode) return;
      setLastScannedBarcode(scanningResult.data);
      const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
      setDetectedProduct(product);
      setBuyCost(String(Math.round(product.retailPrice * 0.5)));
      setScanState("detected");
      triggerHaptic(product.materialCost > 100);
    },
    [scanState, lastScannedBarcode],
  );

  const handleAnalyze = useCallback(() => {
    if (!detectedProduct) return;
    setScanState("analyzing");
    setScannedCount((c) => c + 1);
    Keyboard.dismiss();
    setTimeout(() => {
      if (batchMode) {
        dismissCard();
      } else {
        setScanState("idle");
        setDetectedProduct(null);
        setLastScannedBarcode(null);
        setBuyCost("");
        router.push("/analysis");
      }
    }, 1800);
  }, [detectedProduct, batchMode, router, dismissCard]);

  const toggleTorch = useCallback(() => setTorchOn((p) => !p), []);
  const toggleBatch = useCallback(() => setBatchMode((p) => !p), []);

  const pickFromGallery = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setScanState("analyzing");
        setTimeout(() => { setScanState("idle"); router.push("/analysis"); }, 2000);
      }
    } catch { setScanState("idle"); }
  }, [router]);

  const handleBack = useCallback(() => {
    if (scanState === "detected") { dismissCard(); return; }
    if (router.canGoBack()) router.back();
    else router.replace("/home");
  }, [scanState, dismissCard, router]);

  if (!permission) return <View style={styles.root} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient colors={["#F0F6E8", "#FFFFFF", "#FFFFFF"]} style={styles.permissionGradient}>
          <View style={[styles.permissionInner, { paddingTop: insets.top + 60 }]}>
            <View style={styles.permissionIconWrap}>
              <View style={styles.permissionIconOuter}>
                <View style={styles.permissionIconInner}>
                  <ScanLine size={28} color="#4A7A28" strokeWidth={2} />
                </View>
              </View>
            </View>
            <Text style={styles.permissionTitle}>Enable Camera</Text>
            <Text style={styles.permissionDesc}>
              Point your camera at any barcode to instantly reveal the real cost,
              markup breakdown, and where to buy it for less.
            </Text>
            <View style={styles.permissionFeatures}>
              <View style={styles.permissionFeature}>
                <View style={[styles.permissionFeatureDot, { backgroundColor: "#4A7A28" }]} />
                <Text style={styles.permissionFeatureText}>Real-time barcode detection</Text>
              </View>
              <View style={styles.permissionFeature}>
                <View style={[styles.permissionFeatureDot, { backgroundColor: "#FF6B1A" }]} />
                <Text style={styles.permissionFeatureText}>Instant price analysis</Text>
              </View>
              <View style={styles.permissionFeature}>
                <View style={[styles.permissionFeatureDot, { backgroundColor: "#4AE88C" }]} />
                <Text style={styles.permissionFeatureText}>Save & track products</Text>
              </View>
            </View>
            <Pressable
              style={({ pressed }) => [styles.permissionButton, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
              onPress={requestPermission}
            >
              <LinearGradient colors={["#2D4A1E", "#1C2A0E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.permissionButtonGradient}>
                <Text style={styles.permissionButtonText}>Enable Camera</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.permissionGalleryBtn, pressed && { opacity: 0.6 }]} onPress={pickFromGallery}>
              <ImageIcon size={16} color="#FF6B1A" strokeWidth={2} />
              <Text style={styles.permissionGalleryText}>Or upload from gallery</Text>
            </Pressable>
          </View>
        </LinearGradient>
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
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "code93", "itf14", "qr"],
        }}
        onBarcodeScanned={scanState === "idle" ? handleBarcodeScanned : undefined}
      />

      <View style={styles.overlay}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <BlurView intensity={80} tint="light" style={styles.headerBlur}>
            <View style={styles.headerContent}>
              <Pressable style={styles.headerBtn} onPress={handleBack} hitSlop={8}>
                <ArrowLeft size={20} color="#1A1A1A" strokeWidth={2.2} />
              </Pressable>
              <View style={styles.headerCenter}>
                <View style={styles.headerDot} />
                <Text style={styles.headerTitle}>Sourcing Engine</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.headerBtn, torchOn && styles.headerBtnActive, pressed && { opacity: 0.8 }]}
                onPress={toggleTorch}
                hitSlop={8}
              >
                {torchOn ? (
                  <Zap size={18} color="#FF6B1A" strokeWidth={2.4} fill="#FF6B1A" />
                ) : (
                  <ZapOff size={18} color="#1A1A1A" strokeWidth={2.2} />
                )}
              </Pressable>
            </View>
          </BlurView>
        </View>

        {/* Viewfinder */}
        <View style={styles.viewfinderArea}>
          <Animated.View style={[styles.boundingBox, cornersStyle]}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <Animated.View style={[styles.innerGrid, gridStyle]}>
              <View style={[styles.gridLine, styles.gridLineV]} />
              <View style={[styles.gridLine, styles.gridLineV2]} />
              <View style={[styles.gridLine, styles.gridLineH]} />
              <View style={[styles.gridLine, styles.gridLineH2]} />
            </Animated.View>
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
            <Animated.View style={[styles.pulseRing, pulseStyle]} />
          </Animated.View>

          {scanState === "idle" && (
            <View style={styles.hintContainer}>
              <View style={styles.hintPill}>
                <ScanLine size={12} color="#4A7A28" strokeWidth={2.5} />
                <Text style={styles.hintText}>Align barcode within the frame</Text>
              </View>
            </View>
          )}

          {scanState === "analyzing" && (
            <View style={styles.analyzingWrap}>
              <View style={styles.analyzingCard}>
                <View style={styles.analyzingSpinner}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.analyzingTitle}>Analyzing</Text>
                  <Text style={styles.analyzingSubtitle}>Comparing prices across 50+ sources</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Bottom Controls — idle state */}
        {scanState === "idle" && !detectedProduct && (
          <View style={[styles.bottomIdle, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.controlsRow}>
              <Pressable style={({ pressed }) => [styles.controlBtn, pressed && { opacity: 0.8 }]} onPress={pickFromGallery}>
                <View style={styles.controlBtnInner}>
                  <ImageIcon size={18} color="#1A1A1A" strokeWidth={2} />
                </View>
                <Text style={styles.controlLabel}>Gallery</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.batchToggle, batchMode && styles.batchToggleActive, pressed && { opacity: 0.85 }]}
                onPress={toggleBatch}
              >
                <Layers size={16} color={batchMode ? "#FFFFFF" : "#888888"} strokeWidth={2} />
                <Text style={[styles.batchLabel, batchMode && styles.batchLabelActive]}>Batch</Text>
                <View style={[styles.batchTrack, batchMode && styles.batchTrackActive]}>
                  <View style={[styles.batchDot, batchMode && styles.batchDotActive]} />
                </View>
              </Pressable>
            </View>
            {batchMode && scannedCount > 0 && (
              <View style={styles.batchCountPill}>
                <Sparkles size={12} color="#4A7A28" strokeWidth={2.5} />
                <Text style={styles.batchCountText}>{scannedCount} item{scannedCount !== 1 ? "s" : ""} scanned</Text>
              </View>
            )}
          </View>
        )}

        {/* Analysis Card — detected state */}
        {scanState === "detected" && detectedProduct && (
          <GestureDetector gesture={swipeDown}>
            <Animated.View style={[styles.analysisCard, { paddingBottom: insets.bottom + 12 }, cardStyle]}>
              {/* Drag handle */}
              <View style={styles.dragHandleWrap}>
                <View style={styles.dragHandle} />
              </View>

              <View style={styles.cardScrollContent}>
                {/* ═══════ ZONE 1: RISK SHIELD ═══════ */}
                <View style={styles.zone1}>
                  <View style={[
                    styles.eligibilityBadge,
                    detectedProduct.isGated ? styles.eligibilityGated : styles.eligibilityUngated,
                  ]}>
                    {detectedProduct.isGated ? (
                      <Lock size={13} color="#FFFFFF" strokeWidth={2.5} />
                    ) : (
                      <BadgeCheck size={13} color="#FFFFFF" strokeWidth={2.5} />
                    )}
                    <Text style={styles.eligibilityText}>
                      {detectedProduct.isGated ? "Gated" : "Ungated"}
                    </Text>
                  </View>

                  {detectedProduct.ipRisk && (
                    <View style={styles.ipAlertBanner}>
                      <AlertTriangle size={13} color="#92400E" strokeWidth={2.5} />
                      <Text style={styles.ipAlertText}>High IP Risk</Text>
                    </View>
                  )}

                  {!detectedProduct.ipRisk && (
                    <View style={styles.lowRiskBadge}>
                      <ShieldCheck size={13} color="#4A7A28" strokeWidth={2.5} />
                      <Text style={styles.lowRiskText}>Low Risk</Text>
                    </View>
                  )}
                </View>

                {/* ═══════ ZONE 2: PRODUCT IDENTITY ═══════ */}
                <View style={styles.zone2}>
                  <View style={styles.zone2Thumb}>
                    <Image source={{ uri: detectedProduct.image }} style={styles.zone2Image} contentFit="cover" />
                  </View>
                  <View style={styles.zone2Info}>
                    <Text style={styles.zone2Category}>{detectedProduct.category}</Text>
                    <Text style={styles.zone2Title} numberOfLines={2}>{detectedProduct.name}</Text>
                    <View style={styles.velocityRow}>
                      <View style={styles.velocityPill}>
                        <TrendingUp size={11} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={styles.velocityText}>
                          #{detectedProduct.salesRank.toLocaleString()}
                        </Text>
                        <View style={styles.velocityDivider} />
                        <Text style={styles.velocityPercent}>
                          {formatSalesRankPercent(detectedProduct.salesRankPercent)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* ═══════ ZONE 3: PROFIT ENGINE ═══════ */}
                <View style={styles.zone3}>
                  <View style={styles.profitRow}>
                    <View style={styles.profitMain}>
                      <Text style={styles.profitLabel}>Net Profit</Text>
                      <Text style={[
                        styles.profitValue,
                        { color: netProfit >= 0 ? "#16A34A" : "#DC2626" },
                      ]}>
                        {netProfit >= 0 ? "+" : ""}${netProfit.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.roiBlock}>
                      <Text style={styles.roiLabel}>ROI</Text>
                      <Text style={[
                        styles.roiValue,
                        { color: roi >= 50 ? "#16A34A" : roi >= 0 ? "#FF6B1A" : "#DC2626" },
                      ]}>
                        {roi.toFixed(0)}%
                      </Text>
                    </View>
                  </View>

                  {/* Cost Input */}
                  <View style={styles.costInputWrap}>
                    <Text style={styles.costInputLabel}>Your Buy Cost</Text>
                    <View style={[styles.costInputBox, costFocused && styles.costInputFocused]}>
                      <CircleDollarSign size={16} color={costFocused ? "#4A7A28" : "#AAAAAA"} strokeWidth={2} />
                      <TextInput
                        ref={costInputRef}
                        style={styles.costInput}
                        value={buyCost}
                        onChangeText={setBuyCost}
                        onFocus={() => setCostFocused(true)}
                        onBlur={() => setCostFocused(false)}
                        placeholder="0.00"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="numeric"
                        returnKeyType="done"
                        selectTextOnFocus
                      />
                    </View>
                  </View>

                  {/* CTA */}
                  <Pressable
                    style={({ pressed }) => [styles.analyzeBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                    onPress={handleAnalyze}
                  >
                    <LinearGradient
                      colors={netProfit > 0 ? ["#2D4A1E", "#1C2A0E"] : ["#374151", "#1F2937"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.analyzeBtnGradient}
                    >
                      <Text style={styles.analyzeBtnText}>
                        {netProfit > 0 ? "View Full Analysis" : "Analyze Product"}
                      </Text>
                      <TrendingUp size={16} color="#FFFFFF" strokeWidth={2.2} />
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
        )}
      </View>
    </View>
  );
}

const CARD_BG = "rgba(255,255,255,0.96)";
const CARD_BORDER = "rgba(0,0,0,0.06)";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000000" },
  overlay: { ...StyleSheet.absoluteFill, justifyContent: "space-between" },

  // ─── Header ───
  header: { paddingHorizontal: 12 },
  headerBlur: {
    borderRadius: 20, overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth, borderColor: CARD_BORDER,
  },
  headerContent: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 8 },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(240,240,243,0.8)",
  },
  headerBtnActive: { backgroundColor: "rgba(255,107,26,0.12)" },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  headerDot: {
    width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#4AE88C",
    shadowColor: "#4AE88C", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 6, elevation: 4,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold", fontSize: 16, fontWeight: "700",
    letterSpacing: -0.3, color: "#1A1A1A",
  },

  // ─── Viewfinder ───
  viewfinderArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  boundingBox: { width: 280, height: 280, position: "relative" },
  corner: { position: "absolute", width: 40, height: 40 },
  cornerTL: {
    top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3,
    borderColor: "#FFFFFF", borderTopLeftRadius: 14,
    shadowColor: "#4AE88C", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 8,
  },
  cornerTR: {
    top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3,
    borderColor: "#FFFFFF", borderTopRightRadius: 14,
    shadowColor: "#4AE88C", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 8,
  },
  cornerBL: {
    bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3,
    borderColor: "#FFFFFF", borderBottomLeftRadius: 14,
    shadowColor: "#4AE88C", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 8,
  },
  cornerBR: {
    bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3,
    borderColor: "#FFFFFF", borderBottomRightRadius: 14,
    shadowColor: "#4AE88C", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 8,
  },
  innerGrid: { position: "absolute", top: 40, left: 40, right: 40, bottom: 40 },
  gridLine: { position: "absolute", backgroundColor: "rgba(255,255,255,0.15)" },
  gridLineV: { top: 0, bottom: 0, left: "33%", width: StyleSheet.hairlineWidth },
  gridLineV2: { top: 0, bottom: 0, left: "66%", width: StyleSheet.hairlineWidth },
  gridLineH: { left: 0, right: 0, top: "33%", height: StyleSheet.hairlineWidth },
  gridLineH2: { left: 0, right: 0, top: "66%", height: StyleSheet.hairlineWidth },
  scanLine: {
    position: "absolute", left: "5%", right: "5%", height: 2,
    backgroundColor: "#4AE88C", borderRadius: 1,
    shadowColor: "#4AE88C", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 10,
  },
  pulseRing: {
    position: "absolute", top: -10, left: -10, right: -10, bottom: -10,
    borderRadius: 22, borderWidth: 1.5, borderColor: "rgba(74,232,140,0.35)",
  },
  hintContainer: { marginTop: 28, alignItems: "center" },
  hintPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 50, borderWidth: StyleSheet.hairlineWidth, borderColor: CARD_BORDER,
  },
  hintText: { ...TypeScale.captionMd, color: "#666666", fontWeight: "500" },

  // ─── Analyzing ───
  analyzingWrap: { marginTop: 28, alignItems: "center" },
  analyzingCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "rgba(28,42,14,0.92)", paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 18, shadowColor: "#1C2A0E", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  analyzingSpinner: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center",
  },
  analyzingTitle: { ...TypeScale.bodyLg, color: "#FFFFFF", fontWeight: "700", letterSpacing: -0.2 },
  analyzingSubtitle: { ...TypeScale.captionSm, color: "rgba(255,255,255,0.6)", fontWeight: "400", marginTop: 1 },

  // ─── Bottom Idle Controls ───
  bottomIdle: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  controlsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 16 },
  controlBtn: { alignItems: "center", gap: 6 },
  controlBtnInner: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth, borderColor: CARD_BORDER,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  controlLabel: { ...TypeScale.captionXs, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  batchToggle: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(255,255,255,0.12)", paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 50, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
  },
  batchToggleActive: { backgroundColor: "#1C2A0E", borderColor: "#1C2A0E" },
  batchLabel: { ...TypeScale.captionMd, color: "rgba(255,255,255,0.5)", fontWeight: "600" },
  batchLabelActive: { color: "#FFFFFF" },
  batchTrack: {
    width: 34, height: 20, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", paddingHorizontal: 2,
  },
  batchTrackActive: { backgroundColor: "#4AE88C" },
  batchDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#FFFFFF" },
  batchDotActive: { alignSelf: "flex-end" },
  batchCountPill: {
    flexDirection: "row", alignItems: "center", alignSelf: "center", gap: 5,
    backgroundColor: "rgba(74,122,40,0.15)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 50,
  },
  batchCountText: { ...TypeScale.captionSm, color: "#4AE88C", fontWeight: "600" },

  // ─── Analysis Card ───
  analysisCard: {
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: CARD_BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
    maxHeight: "55%",
  },
  dragHandleWrap: { alignItems: "center", paddingTop: 10, paddingBottom: 4 },
  dragHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  cardScrollContent: { paddingHorizontal: 20, gap: 14, paddingBottom: 4 },

  // ─── Zone 1: Risk Shield ───
  zone1: { flexDirection: "row", alignItems: "center", gap: 8 },
  eligibilityBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  eligibilityGated: { backgroundColor: "#DC2626" },
  eligibilityUngated: { backgroundColor: "#16A34A" },
  eligibilityText: { ...TypeScale.captionSm, color: "#FFFFFF", fontWeight: "700", letterSpacing: 0.2 },
  ipAlertBanner: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#FEF3C7", paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, borderWidth: 1, borderColor: "#FDE68A",
  },
  ipAlertText: { ...TypeScale.captionSm, color: "#92400E", fontWeight: "700" },
  lowRiskBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#F0F6E8", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  lowRiskText: { ...TypeScale.captionSm, color: "#4A7A28", fontWeight: "600" },

  // ─── Zone 2: Product Identity ───
  zone2: { flexDirection: "row", gap: 12 },
  zone2Thumb: {
    width: 72, height: 72, borderRadius: 14, overflow: "hidden",
    backgroundColor: "#F0F0F3", borderWidth: StyleSheet.hairlineWidth, borderColor: CARD_BORDER,
  },
  zone2Image: { width: "100%", height: "100%" },
  zone2Info: { flex: 1, justifyContent: "center", gap: 3 },
  zone2Category: {
    ...TypeScale.captionXs, color: "#888888", fontWeight: "600",
    textTransform: "uppercase", letterSpacing: 0.8,
  },
  zone2Title: {
    fontFamily: "Inter_700Bold", fontSize: 15, fontWeight: "700",
    lineHeight: 20, letterSpacing: -0.3, color: "#1A1A1A",
  },
  velocityRow: { flexDirection: "row", marginTop: 2 },
  velocityPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#1C2A0E", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  velocityText: { ...TypeScale.captionXs, color: "#FFFFFF", fontWeight: "700" },
  velocityDivider: { width: 1, height: 10, backgroundColor: "rgba(255,255,255,0.25)", marginHorizontal: 2 },
  velocityPercent: { ...TypeScale.captionXs, color: "#4AE88C", fontWeight: "700" },

  // ─── Zone 3: Profit Engine ───
  zone3: { gap: 12 },
  profitRow: {
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
  },
  profitMain: { gap: 1 },
  profitLabel: { ...TypeScale.captionXs, color: "#888888", fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5 },
  profitValue: {
    fontFamily: "Inter_800ExtraBold", fontSize: 32, fontWeight: "800",
    lineHeight: 36, letterSpacing: -1.2,
  },
  roiBlock: { alignItems: "flex-end", gap: 1 },
  roiLabel: { ...TypeScale.captionXs, color: "#888888", fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5 },
  roiValue: {
    fontFamily: "Inter_700Bold", fontSize: 22, fontWeight: "700",
    lineHeight: 26, letterSpacing: -0.5,
  },

  costInputWrap: { gap: 5 },
  costInputLabel: { ...TypeScale.captionXs, color: "#888888", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  costInputBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    height: 48, borderRadius: 14,
    borderWidth: 1.5, borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
  },
  costInputFocused: {
    borderColor: "#4A7A28",
    backgroundColor: "#FFFFFF",
    shadowColor: "#4A7A28", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 2,
  },
  costInput: {
    flex: 1, ...TypeScale.bodyLg, fontWeight: "700",
    color: "#1A1A1A", padding: 0, fontSize: 18,
  },

  analyzeBtn: {
    height: 52, borderRadius: 16, overflow: "hidden",
    shadowColor: "#1C2A0E", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  analyzeBtnGradient: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
  },
  analyzeBtnText: { ...TypeScale.bodyLg, color: "#FFFFFF", fontWeight: "700", letterSpacing: 0.2 },

  // ─── Permission Screen ───
  permissionContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  permissionGradient: { flex: 1 },
  permissionInner: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 36, gap: 20 },
  permissionIconWrap: { marginBottom: 4 },
  permissionIconOuter: {
    width: 88, height: 88, borderRadius: 28, backgroundColor: "#F0F6E8",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(74,122,40,0.12)",
  },
  permissionIconInner: {
    width: 56, height: 56, borderRadius: 18, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#4A7A28", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
  },
  permissionTitle: {
    fontFamily: "Inter_700Bold", fontSize: 28, fontWeight: "700",
    letterSpacing: -0.84, color: "#1A1A1A", textAlign: "center",
  },
  permissionDesc: { ...TypeScale.bodyMd, color: "#888888", textAlign: "center", lineHeight: 22 },
  permissionFeatures: { gap: 12, marginTop: 4, alignSelf: "stretch" },
  permissionFeature: { flexDirection: "row", alignItems: "center", gap: 10 },
  permissionFeatureDot: { width: 6, height: 6, borderRadius: 3 },
  permissionFeatureText: { ...TypeScale.bodyMd, color: "#666666", fontWeight: "500" },
  permissionButton: {
    width: "100%", height: 56, borderRadius: 28, overflow: "hidden", marginTop: 12,
    shadowColor: "#1C2A0E", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 6,
  },
  permissionButtonGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
  permissionButtonText: { ...TypeScale.bodyLg, color: "#FFFFFF", fontWeight: "700", letterSpacing: 0.2 },
  permissionGalleryBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, marginTop: 8,
  },
  permissionGalleryText: { ...TypeScale.bodyMd, fontWeight: "600", color: "#FF6B1A" },
});
