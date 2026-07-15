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
  SharedValue,
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
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ShieldCheck,
  TrendingDown,
} from "lucide-react-native";
import { useResponsive } from "@/hooks/use-responsive";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList as new (...args: any[]) => FlatList<any>
);

const AUTO_PLAY_MS = 5400;

interface OnboardingSlide {
  id: string;
  image: string;
  alt: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  ctaLabel: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "markup-reality",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=90&w=1400",
    alt: "Designer handbag with luxury accessories",
    title: "You're Overpaying. Right Now.",
    subtitle:
      "Most retail products cost 5\u201310x less to manufacture than what you pay at checkout.",
    ctaLabel: "See How",
  },
  {
    id: "scan-expose",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=1400",
    alt: "Premium sneakers photographed like a limited drop",
    title: "Scan. See. Save.",
    subtitle:
      "Point your camera at any product. Instantly see the real cost, material breakdown, and where to buy it for less.",
    ctaLabel: "Try It",
  },
  {
    id: "never-overpay",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=90&w=1400",
    alt: "Close-up of a luxury watch with polished details",
    title: "Never Overpay Again",
    subtitle:
      "Join 50,000+ smart shoppers who save an average of $340 every month.",
    ctaLabel: "Start Saving",
  },
];

const MARKUP_DATA = [
  { product: "Premium Handbag", retail: "$249", cost: "$31", markup: "703%" },
  { product: "Running Sneakers", retail: "$180", cost: "$28", markup: "543%" },
  { product: "Luxury Watch", retail: "$450", cost: "$62", markup: "626%" },
];

const BREAKDOWN_ROWS = [
  { label: "Retail Price", value: "$249", color: "#1A1A1A" },
  { label: "Material Cost", value: "$31", color: "#4A7A28" },
  { label: "You'd Save", value: "$218", color: "#FF6B1A" },
];

const SAVED_ITEMS = [
  { name: "AirPods Pro", saved: "$89", img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=400" },
  { name: "Leather Jacket", saved: "$312", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400" },
  { name: "Running Shoes", saved: "$113", img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=400" },
];

function useEntranceAnimation(isActive: boolean, delayMs = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => {
        opacity.value = withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        });
        translateY.value = withSpring(0, {
          damping: 16,
          stiffness: 140,
          mass: 0.8,
        });
      }, delayMs);
      return () => clearTimeout(t);
    }
    opacity.value = withTiming(0, { duration: 160 });
    translateY.value = withTiming(14, { duration: 160 });
  }, [isActive]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

function MarkupPriceCard({ isActive }: { isActive: boolean }) {
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.88);

  const stripeWidth = useSharedValue(0);
  const costOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      const t1 = setTimeout(() => {
        cardScale.value = withSpring(1, {
          damping: 14,
          stiffness: 160,
          mass: 0.7,
        });
        cardOpacity.value = withTiming(1, {
          duration: 450,
          easing: Easing.out(Easing.cubic),
        });
      }, 200);

      const t2 = setTimeout(() => {
        stripeWidth.value = withTiming(1, {
          duration: 380,
          easing: Easing.out(Easing.cubic),
        });
      }, 750);

      const t3 = setTimeout(() => {
        costOpacity.value = withTiming(1, {
          duration: 350,
          easing: Easing.out(Easing.cubic),
        });
      }, 1050);

      const t4 = setTimeout(() => {
        badgeScale.value = withSpring(1, {
          damping: 10,
          stiffness: 180,
          mass: 0.6,
        });
      }, 1300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    cardScale.value = withTiming(0.88, { duration: 140 });
    cardOpacity.value = withTiming(0, { duration: 140 });
    stripeWidth.value = withTiming(0, { duration: 0 });
    costOpacity.value = withTiming(0, { duration: 0 });
    badgeScale.value = withTiming(0, { duration: 0 });
  }, [isActive]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const stripeStyle = useAnimatedStyle(() => ({
    width: `${interpolate(stripeWidth.value, [0, 1], [0, 100])}%`,
  }));

  const costStyle = useAnimatedStyle(() => ({
    opacity: costOpacity.value,
    transform: [
      {
        translateY: interpolate(costOpacity.value, [0, 1], [8, 0]),
      },
    ],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));

  const data = MARKUP_DATA[0];

  return (
    <Animated.View style={[styles.priceCard, cardStyle]}>
      <Text style={styles.priceCardLabel}>{data.product}</Text>

      <View style={styles.priceCardPriceRow}>
        <Text style={styles.priceCardRetail}>{data.retail}</Text>
        <Animated.View style={[styles.strikeThrough, stripeStyle]} />
      </View>

      <Animated.View style={costStyle}>
        <View style={styles.priceCardDivider} />
        <View style={styles.priceCardCostRow}>
          <Text style={styles.priceCardCostLabel}>Actual Cost</Text>
          <Text style={styles.priceCardCost}>{data.cost}</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.markupBadge, badgeStyle]}>
        <Text style={styles.markupBadgeText}>{data.markup} Markup</Text>
      </Animated.View>
    </Animated.View>
  );
}

function ScanDemo({ isActive }: { isActive: boolean }) {
  const scanLineY = useSharedValue(0);
  const scanActive = useSharedValue(0);
  const cardReveal = useSharedValue(0);
  const row1 = useSharedValue(0);
  const row2 = useSharedValue(0);
  const row3 = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      const t0 = setTimeout(() => {
        scanActive.value = 1;
        scanLineY.value = withTiming(1, {
          duration: 1400,
          easing: Easing.inOut(Easing.cubic),
        });
      }, 350);

      const t1 = setTimeout(() => {
        scanActive.value = 0;
        scanLineY.value = withTiming(0, { duration: 0 });
        cardReveal.value = withSpring(1, {
          damping: 15,
          stiffness: 140,
          mass: 0.7,
        });
      }, 1800);

      const t2 = setTimeout(() => {
        row1.value = withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      }, 2050);

      const t3 = setTimeout(() => {
        row2.value = withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      }, 2200);

      const t4 = setTimeout(() => {
        row3.value = withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      }, 2350);

      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    scanActive.value = 0;
    scanLineY.value = withTiming(0, { duration: 0 });
    cardReveal.value = withTiming(0, { duration: 0 });
    row1.value = withTiming(0, { duration: 0 });
    row2.value = withTiming(0, { duration: 0 });
    row3.value = withTiming(0, { duration: 0 });
  }, [isActive]);

  const scanLineStyle = useAnimatedStyle(() => ({
    opacity: scanActive.value,
    top: `${interpolate(scanLineY.value, [0, 1], [15, 85])}%`,
  }));

  const scanCornersStyle = useAnimatedStyle(() => ({
    opacity: scanActive.value,
    transform: [
      {
        scale: interpolate(scanActive.value, [0, 1], [0.95, 1]),
      },
    ],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(cardReveal.value, [0, 1], [60, 0]),
      },
    ],
    opacity: cardReveal.value,
  }));

  const makeRowStyle = (sv: SharedValue<number>) =>
    useAnimatedStyle(() => ({
      opacity: sv.value,
      transform: [
        {
          translateX: interpolate(sv.value, [0, 1], [20, 0]),
        },
      ],
    }));

  const r1 = makeRowStyle(row1);
  const r2 = makeRowStyle(row2);
  const r3 = makeRowStyle(row3);

  return (
    <View style={styles.scanContainer}>
      <Animated.View style={[styles.scanCorners, scanCornersStyle]}>
        <View style={[styles.cornerBracket, styles.cornerTL]} />
        <View style={[styles.cornerBracket, styles.cornerTR]} />
        <View style={[styles.cornerBracket, styles.cornerBL]} />
        <View style={[styles.cornerBracket, styles.cornerBR]} />
      </Animated.View>

      <Animated.View style={[styles.scanLine, scanLineStyle]} />

      <Animated.View style={[styles.scanBreakdownCard, cardStyle]}>
        <Animated.View style={[styles.scanBreakdownRow, r1]}>
          <Text style={styles.scanBreakdownLabel}>Retail Price</Text>
          <Text style={styles.scanBreakdownValue}>{BREAKDOWN_ROWS[0].value}</Text>
        </Animated.View>
        <View style={styles.scanBreakdownDivider} />
        <Animated.View style={[styles.scanBreakdownRow, r2]}>
          <Text style={styles.scanBreakdownLabel}>Material Cost</Text>
          <Text style={[styles.scanBreakdownValue, { color: "#4A7A28" }]}>
            {BREAKDOWN_ROWS[1].value}
          </Text>
        </Animated.View>
        <View style={styles.scanBreakdownDivider} />
        <Animated.View style={[styles.scanBreakdownRow, r3]}>
          <Text style={styles.scanBreakdownLabel}>You'd Save</Text>
          <Text style={[styles.scanBreakdownValue, { color: "#FF6B1A" }]}>
            {BREAKDOWN_ROWS[2].value}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function SavingsReveal({ isActive }: { isActive: boolean }) {
  const mainOpacity = useSharedValue(0);
  const mainTranslateY = useSharedValue(20);
  const item1 = useSharedValue(0);
  const item2 = useSharedValue(0);
  const item3 = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      const t0 = setTimeout(() => {
        mainOpacity.value = withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        });
        mainTranslateY.value = withSpring(0, {
          damping: 14,
          stiffness: 130,
          mass: 0.8,
        });
      }, 250);

      const t1 = setTimeout(() => {
        item1.value = withSpring(1, {
          damping: 12,
          stiffness: 150,
          mass: 0.6,
        });
      }, 650);

      const t2 = setTimeout(() => {
        item2.value = withSpring(1, {
          damping: 12,
          stiffness: 150,
          mass: 0.6,
        });
      }, 780);

      const t3 = setTimeout(() => {
        item3.value = withSpring(1, {
          damping: 12,
          stiffness: 150,
          mass: 0.6,
        });
      }, 910);

      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    mainOpacity.value = withTiming(0, { duration: 140 });
    mainTranslateY.value = withTiming(16, { duration: 140 });
    item1.value = withTiming(0, { duration: 0 });
    item2.value = withTiming(0, { duration: 0 });
    item3.value = withTiming(0, { duration: 0 });
  }, [isActive]);

  const mainStyle = useAnimatedStyle(() => ({
    opacity: mainOpacity.value,
    transform: [{ translateY: mainTranslateY.value }],
  }));

  const makeItemStyle = (sv: SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [
        { scale: interpolate(sv.value, [0, 1], [0.7, 1]) },
        { translateY: interpolate(sv.value, [0, 1], [16, 0]) },
      ],
      opacity: sv.value,
    }));

  const s1 = makeItemStyle(item1);
  const s2 = makeItemStyle(item2);
  const s3 = makeItemStyle(item3);

  return (
    <Animated.View style={[styles.savingsContainer, mainStyle]}>
      <Text style={styles.savingsAmount}>$340</Text>
      <Text style={styles.savingsLabel}>avg. saved per month</Text>

      <View style={styles.savingsItems}>
        {SAVED_ITEMS.map((item, i) => {
          const animStyle = [s1, s2, s3][i];
          return (
            <Animated.View key={item.name} style={[styles.savingsItem, animStyle]}>
              <Image
                source={{ uri: item.img }}
                style={styles.savingsItemImg}
                contentFit="cover"
              />
              <View style={styles.savingsItemOverlay}>
                <TrendingDown size={10} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.savingsItemSaved}>{item.saved}</Text>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}

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
  scrollX: SharedValue<number>;
  containerWidth: number;
  imageHeight: number;
  isActive: boolean;
}) {
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
            [containerWidth * 0.08, 0, -containerWidth * 0.08],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            [1.12, 1.04, 1.12],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={{ width: containerWidth, height: imageHeight, overflow: "hidden" }}>
      <Animated.View
        style={[
          { width: "122%", height: "110%", marginLeft: "-11%", marginTop: "-5%" },
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
        colors={
          index === 0
            ? [
                "rgba(28,20,10,0.15)",
                "rgba(28,20,10,0.25)",
                "rgba(28,20,10,0.65)",
              ]
            : index === 1
            ? [
                "rgba(10,28,20,0.15)",
                "rgba(10,28,20,0.25)",
                "rgba(10,28,20,0.65)",
              ]
            : [
                "rgba(28,15,10,0.15)",
                "rgba(28,15,10,0.25)",
                "rgba(28,15,10,0.65)",
              ]
        }
        locations={[0, 0.4, 1]}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />

      {index === 0 && <MarkupPriceCard isActive={isActive} />}
      {index === 1 && <ScanDemo isActive={isActive} />}
      {index === 2 && <SavingsReveal isActive={isActive} />}
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
  const contentTranslateY = useSharedValue(14);
  const buttonScale = useSharedValue(1);

  const containerWidth = useMemo(
    () => Math.min(screenWidth, MAX_WIDTH),
    [screenWidth]
  );
  const imageHeight = useMemo(() => screenHeight * 0.62, [screenHeight]);
  const bottomMinHeight = useMemo(() => screenHeight * 0.40, [screenHeight]);
  const ctaWidth = useMemo(() => containerWidth - 48, [containerWidth]);

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
      duration: 100,
      easing: Easing.in(Easing.cubic),
    });
    contentTranslateY.value = withTiming(-10, {
      duration: 100,
      easing: Easing.in(Easing.cubic),
    });

    const t = setTimeout(() => {
      setDisplayedIndex(activeIndex);
      contentOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      contentTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    }, 120);

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

  const trustPillStyle = useEntranceAnimation(activeIndex === 0, 1200);
  const ctaPulse = useSharedValue(1);

  useEffect(() => {
    if (activeIndex === 2) {
      ctaPulse.value = withSpring(1.02, {
        damping: 8,
        stiffness: 120,
        mass: 0.5,
      });
      const t = setTimeout(() => {
        ctaPulse.value = withSpring(1, {
          damping: 12,
          stiffness: 100,
        });
      }, 400);
      return () => clearTimeout(t);
    }
    ctaPulse.value = withTiming(1, { duration: 200 });
  }, [activeIndex]);

  const ctaPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaPulse.value }],
  }));

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
          <BlurView intensity={60} tint="dark" style={styles.skipBlur}>
            <Text style={styles.skipText}>Skip</Text>
          </BlurView>
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
          <Animated.View style={[styles.trustPill, trustPillStyle]}>
            <ShieldCheck size={13} color="#4A7A28" strokeWidth={2.4} />
            <Text style={styles.trustPillText}>
              Trusted by 50,000+ shoppers
            </Text>
          </Animated.View>

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

            <View style={styles.progressSegments}>
              {SLIDES.map((slide, index) => {
                const isSegmentActive = index === activeIndex;
                const isSegmentPast = index < activeIndex;
                return (
                  <Pressable
                    key={slide.id}
                    onPress={() => handleDotPress(index)}
                    hitSlop={8}
                  >
                    <Animated.View
                      style={[
                        styles.segment,
                        isSegmentActive && styles.segmentActive,
                        isSegmentPast && styles.segmentPast,
                        {
                          width: withSpring(isSegmentActive ? 32 : 8, {
                            stiffness: 200,
                            damping: 18,
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
                style={[
                  styles.ctaButton,
                  buttonStyle,
                  ctaPulseStyle,
                  { width: ctaWidth },
                ]}
              >
                <LinearGradient
                  colors={
                    activeIndex === 2
                      ? ["#2D4A1E", "#1C2A0E"]
                      : ["#1C2A0E", "#152209"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaText}>{currentSlide.ctaLabel}</Text>
                </LinearGradient>
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
    backgroundColor: "#0D0D0D",
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
    backgroundColor: "rgba(255,255,255,0.15)",
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
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.2)",
  },
  skipBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  skipText: {
    ...TypeScale.captionLg,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  carousel: {
    overflow: "hidden",
  },
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
  priceCard: {
    position: "absolute",
    top: "18%",
    alignSelf: "center",
    width: 210,
    backgroundColor: "rgba(255,255,255,0.93)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  priceCardLabel: {
    ...TypeScale.captionMd,
    fontWeight: "600",
    color: "#888888",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  priceCardPriceRow: {
    marginTop: 10,
    position: "relative",
    overflow: "hidden",
  },
  priceCardRetail: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 38,
    letterSpacing: -1.5,
    color: "#1A1A1A",
  },
  strikeThrough: {
    position: "absolute",
    top: "50%",
    left: 0,
    height: 3,
    backgroundColor: "#E8453C",
    borderRadius: 1.5,
    transform: [{ translateY: -1.5 }],
  },
  priceCardDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 12,
  },
  priceCardCostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceCardCostLabel: {
    ...TypeScale.captionMd,
    color: "#888888",
  },
  priceCardCost: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.7,
    color: "#4A7A28",
  },
  markupBadge: {
    marginTop: 14,
    backgroundColor: "#E8453C",
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  markupBadgeText: {
    ...TypeScale.captionMd,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  scanContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  scanCorners: {
    position: "absolute",
    width: 220,
    height: 220,
  },
  cornerBracket: {
    position: "absolute",
    width: 40,
    height: 40,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderTopLeftRadius: 14,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderTopRightRadius: 14,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomLeftRadius: 14,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FFFFFF",
    borderBottomRightRadius: 14,
  },
  scanLine: {
    position: "absolute",
    left: "20%",
    right: "20%",
    height: 2,
    backgroundColor: "#4AE88C",
    borderRadius: 1,
    shadowColor: "#4AE88C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  scanBreakdownCard: {
    position: "absolute",
    bottom: "12%",
    alignSelf: "center",
    width: 240,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  scanBreakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  scanBreakdownLabel: {
    ...TypeScale.captionMd,
    color: "#888888",
  },
  scanBreakdownValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.36,
    color: "#1A1A1A",
  },
  scanBreakdownDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  savingsContainer: {
    position: "absolute",
    bottom: "12%",
    alignSelf: "center",
    alignItems: "center",
  },
  savingsAmount: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 64,
    fontWeight: "800",
    lineHeight: 68,
    letterSpacing: -3,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  savingsLabel: {
    ...TypeScale.bodyMd,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
    marginTop: -4,
  },
  savingsItems: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  savingsItem: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  savingsItemImg: {
    width: "100%",
    height: "100%",
  },
  savingsItemOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(28,42,14,0.88)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 3,
  },
  savingsItemSaved: {
    ...TypeScale.captionXs,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  trustPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    backgroundColor: "#F0F6E8",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  trustPillText: {
    ...TypeScale.captionSm,
    fontWeight: "600",
    color: "#4A7A28",
    letterSpacing: 0.1,
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
    marginTop: 12,
    maxWidth: 320,
    textAlign: "center",
    color: "#777777",
    lineHeight: 21,
  },
  progressSegments: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 24,
  },
  segment: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E8E8E8",
  },
  segmentActive: {
    backgroundColor: "#1C2A0E",
  },
  segmentPast: {
    backgroundColor: "#4A7A28",
  },
  ctaButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#1C2A0E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
    elevation: 8,
  },
  ctaGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  ctaText: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
