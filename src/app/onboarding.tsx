import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  Easing,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "@/hooks/use-responsive";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList as new (...args: any[]) => FlatList<any>
);

const AUTO_PLAY_MS = 4200;

interface OnboardingSlide {
  id: string;
  image: string;
  alt: string;
  productName: string;
  retailPrice: string;
  actualCost: string;
  markupLabel: string;
  markupColor: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "markup-reality",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=90&w=1400",
    alt: "Designer handbag with luxury accessories",
    productName: "Premium Handbag",
    retailPrice: "$249",
    actualCost: "$31",
    markupLabel: "703% Markup",
    markupColor: "#FF6B1A",
    title: "The Markup is Real",
    subtitle:
      "Most products cost 5\u201310x less to make than what you pay.",
    ctaLabel: "Continue",
  },
  {
    id: "scan-expose",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=1400",
    alt: "Premium sneakers photographed like a limited drop",
    productName: "Running Sneakers",
    retailPrice: "$180",
    actualCost: "$28",
    markupLabel: "Found for $67",
    markupColor: "#4A7A28",
    title: "Scan Any Product",
    subtitle:
      "Point your camera. Instantly see the real cost breakdown.",
    ctaLabel: "Continue",
  },
  {
    id: "never-overpay",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=90&w=1400",
    alt: "Close-up of a luxury watch with polished details",
    productName: "Luxury Watch",
    retailPrice: "$450",
    actualCost: "$62",
    markupLabel: "You Save $388",
    markupColor: "#1B4332",
    title: "Never Overpay Again",
    subtitle:
      "Smarter shopping starts with knowing the truth.",
    ctaLabel: "Get Started",
  },
];

function Slide({
  item,
  index,
  scrollX,
  containerWidth,
  imageHeight,
  isActive,
}: {
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.SharedValue<number>;
  containerWidth: number;
  imageHeight: number;
  isActive: boolean;
}) {
  const cardScale = useSharedValue(0.82);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => {
        cardScale.value = withSpring(1, {
          damping: 13,
          stiffness: 170,
          mass: 0.7,
        });
        cardOpacity.value = withTiming(1, {
          duration: 420,
          easing: Easing.out(Easing.cubic),
        });
      }, 100);
      return () => clearTimeout(t);
    }
    cardScale.value = withTiming(0.82, { duration: 180 });
    cardOpacity.value = withTiming(0, { duration: 180 });
  }, [isActive]);

  const imageStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * containerWidth,
      index * containerWidth,
      (index + 1) * containerWidth,
    ];
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            inputRange,
            [containerWidth * 0.09, 0, -containerWidth * 0.09],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            [1.1, 1.04, 1.1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  return (
    <View style={{ width: containerWidth, height: imageHeight }}>
      <Animated.View
        style={[
          { width: "120%", height: "100%", marginLeft: "-10%" },
          imageStyle,
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.slideImage}
          contentFit="cover"
        />
      </Animated.View>

      <LinearGradient
        colors={[
          "rgba(255,244,230,0.22)",
          "rgba(255,222,184,0.12)",
          "rgba(118,68,24,0.18)",
        ]}
        locations={[0, 0.45, 1]}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />

      <Animated.View style={[styles.markupCard, cardStyle]}>
        <Text style={styles.cardProduct}>{item.productName}</Text>
        <View style={styles.cardDivider} />
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Retail</Text>
          <Text style={styles.cardRetail}>{item.retailPrice}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Actual Cost</Text>
          <Text style={styles.cardCost}>{item.actualCost}</Text>
        </View>
        <View style={styles.cardDivider} />
        <Text style={[styles.cardMarkup, { color: item.markupColor }]}>
          {item.markupLabel}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);

  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
  const activeIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const hasInitialized = useRef(false);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { fontScale } = useResponsive();

  const scrollX = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(12);
  const buttonScale = useSharedValue(1);

  const containerWidth = useMemo(
    () => Math.min(screenWidth, MAX_WIDTH),
    [screenWidth]
  );
  const imageHeight = useMemo(() => screenHeight * 0.58, [screenHeight]);
  const bottomMinHeight = useMemo(() => screenHeight * 0.44, [screenHeight]);
  const ctaWidth = useMemo(() => containerWidth - 56, [containerWidth]);

  const containerWidthSV = useSharedValue(containerWidth);
  useEffect(() => {
    containerWidthSV.value = containerWidth;
  }, [containerWidth]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    progressWidth.value = withSpring(
      ((activeIndex + 1) / SLIDES.length) * 100,
      { damping: 22, stiffness: 200 }
    );
  }, [activeIndex]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const t = setTimeout(() => {
        setDisplayedIndex(0);
        contentOpacity.value = withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.cubic),
        });
        contentTranslateY.value = withTiming(0, {
          duration: 600,
          easing: Easing.out(Easing.cubic),
        });
      }, 500);
      return () => clearTimeout(t);
    }

    contentOpacity.value = withTiming(0, {
      duration: 120,
      easing: Easing.in(Easing.cubic),
    });
    contentTranslateY.value = withTiming(-8, {
      duration: 120,
      easing: Easing.in(Easing.cubic),
    });

    const t = setTimeout(() => {
      setDisplayedIndex(activeIndex);
      contentOpacity.value = withTiming(1, {
        duration: 380,
        easing: Easing.out(Easing.cubic),
      });
      contentTranslateY.value = withTiming(0, {
        duration: 380,
        easing: Easing.out(Easing.cubic),
      });
    }, 140);

    return () => clearTimeout(t);
  }, [activeIndex]);

  const progressFillStyle = useAnimatedStyle(() => ({
    width: interpolate(
      progressWidth.value,
      [0, 100],
      [0, containerWidthSV.value],
      Extrapolation.CLAMP
    ),
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const goToSlide = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, SLIDES.length - 1));
    flatListRef.current?.scrollToIndex({
      index: clamped,
      animated: true,
    });
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  }, []);

  const goToNextSlide = useCallback(() => {
    const next = (activeIndexRef.current + 1) % SLIDES.length;
    goToSlide(next);
  }, [goToSlide]);

  const resetAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNextSlide, AUTO_PLAY_MS);
  }, [goToNextSlide]);

  useEffect(() => {
    intervalRef.current = setInterval(goToNextSlide, AUTO_PLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goToNextSlide]);

  const handleDotPress = useCallback(
    (index: number) => {
      goToSlide(index);
      resetAutoPlay();
    },
    [goToSlide, resetAutoPlay]
  );

  const handleScrollBeginDrag = useCallback(() => {
    resetAutoPlay();
  }, [resetAutoPlay]);

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{ index: number | null }>;
    }) => {
      const index = viewableItems[0]?.index;
      if (
        index !== null &&
        index !== undefined &&
        index !== activeIndexRef.current
      ) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        e.nativeEvent.contentOffset.x / containerWidth
      );
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    },
    [containerWidth]
  );

  const renderSlide = useCallback(
    ({ item, index }: { item: OnboardingSlide; index: number }) => (
      <Slide
        item={item}
        index={index}
        scrollX={scrollX}
        containerWidth={containerWidth}
        imageHeight={imageHeight}
        isActive={index === activeIndex}
      />
    ),
    [containerWidth, imageHeight, activeIndex, scrollX]
  );

  const keyExtractor = useCallback(
    (item: OnboardingSlide) => item.id,
    []
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: containerWidth,
      offset: containerWidth * index,
      index,
    }),
    [containerWidth]
  );

  const currentSlide = SLIDES[displayedIndex];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View
        style={[
          styles.phoneContainer,
          { width: containerWidth, height: screenHeight },
        ]}
      >
        <View
          style={[styles.progressTrack, { paddingTop: insets.top }]}
        >
          <Animated.View
            style={[styles.progressFill, progressFillStyle]}
          />
        </View>

        <Pressable
          style={[styles.skipButton, { top: insets.top + 14, right: 20 }]}
          onPress={() => router.replace("/login")}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.05)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.skipGradient}
          >
            <Text style={styles.skipText}>Skip</Text>
          </LinearGradient>
        </Pressable>

        <AnimatedFlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={getItemLayout}
          style={[styles.carousel, { height: imageHeight }]}
          removeClippedSubviews={false}
        />

        <View
          style={[
            styles.bottomSection,
            {
              minHeight: bottomMinHeight,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <View style={styles.content}>
            <Animated.View style={contentStyle}>
              <Text
                style={[
                  styles.title,
                  { fontSize: fontScale(TypeScale.headingLg.fontSize) },
                ]}
              >
                {currentSlide.title}
              </Text>
              <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
            </Animated.View>

            <View style={styles.dotsContainer}>
              {SLIDES.map((slide, index) => {
                const isDotActive = index === activeIndex;
                return (
                  <Pressable
                    key={slide.id}
                    onPress={() => handleDotPress(index)}
                    hitSlop={8}
                  >
                    <Animated.View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: isDotActive ? "#FF6B1A" : "#D8D8D8",
                          width: withSpring(isDotActive ? 24 : 8, {
                            stiffness: 200,
                            damping: 15,
                          }),
                        },
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => {
                if (activeIndex < SLIDES.length - 1) {
                  goToSlide(activeIndex + 1);
                  resetAutoPlay();
                } else {
                  router.replace("/signup");
                }
              }}
              onPressIn={() => {
                buttonScale.value = withTiming(0.97, { duration: 80 });
              }}
              onPressOut={() => {
                buttonScale.value = withSpring(1, {
                  damping: 15,
                  stiffness: 300,
                });
              }}
            >
              <Animated.View
                style={[styles.ctaButton, buttonStyle, { width: ctaWidth }]}
              >
                <Text style={styles.ctaText}>{currentSlide.ctaLabel}</Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneContainer: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    position: "relative",
  },
  progressTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    zIndex: 30,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B1A",
    borderRadius: 1.5,
  },
  skipButton: {
    position: "absolute",
    zIndex: 30,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  skipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    ...TypeScale.captionLg,
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  carousel: {},
  slideImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  markupCard: {
    position: "absolute",
    top: "22%",
    alignSelf: "center",
    width: 200,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  cardProduct: {
    ...TypeScale.captionMd,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardLabel: {
    ...TypeScale.captionSm,
    color: "#888888",
  },
  cardRetail: {
    ...TypeScale.captionMd,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  cardCost: {
    ...TypeScale.captionMd,
    fontWeight: "600",
    color: "#4A7A28",
  },
  cardMarkup: {
    ...TypeScale.sectionMd,
    fontWeight: "700",
    textAlign: "center",
  },
  bottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    ...TypeScale.headingLg,
    textAlign: "center",
    color: "#1A1A1A",
  },
  subtitle: {
    ...TypeScale.muted,
    marginTop: 14,
    maxWidth: 310,
    textAlign: "center",
    color: "#888888",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 28,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    marginTop: 28,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: "#1C2A0E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 6,
  },
  ctaText: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
