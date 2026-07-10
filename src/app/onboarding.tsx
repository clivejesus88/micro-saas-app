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
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "@/hooks/use-responsive";
import { MAX_WIDTH } from "@/constants/layout";

const AUTO_PLAY_MS = 3500;

interface OnboardingSlide {
  id: string;
  image: string;
  alt: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "luxury-flatlay",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=90&w=1400",
    alt: "Aspirational flatlay of a designer handbag and luxury accessories",
  },
  {
    id: "sneaker-drop",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=90&w=1400",
    alt: "Premium sneakers photographed like a limited retail drop",
  },
  {
    id: "watch-detail",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=90&w=1400",
    alt: "Close-up of a luxury watch with polished lifestyle details",
  },
];

function Slide({
  item,
  containerWidth,
  imageHeight,
}: {
  item: OnboardingSlide;
  containerWidth: number;
  imageHeight: number;
}) {
  return (
    <View style={{ width: containerWidth, height: imageHeight }}>
      <Image
        source={{ uri: item.image }}
        style={styles.slideImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={[
          "rgba(255,244,230,0.26)",
          "rgba(255,222,184,0.16)",
          "rgba(118,68,24,0.18)",
        ]}
        locations={[0, 0.48, 1]}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
    </View>
  );
}

function Dot({
  index,
  activeIndex,
  onPress,
}: {
  index: number;
  activeIndex: number;
  onPress: (index: number) => void;
}) {
  const isActive = index === activeIndex;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isActive ? 24 : 8, {
      stiffness: 200,
      damping: 15,
    }),
  }));

  return (
    <Pressable onPress={() => onPress(index)} hitSlop={8}>
      <Animated.View
        style={[
          styles.dot,
          animatedStyle,
          { backgroundColor: isActive ? "#FF6B1A" : "#D8D8D8" },
        ]}
      />
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
  const activeIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { fontScale } = useResponsive();

  const containerWidth = useMemo(
    () => Math.min(screenWidth, MAX_WIDTH),
    [screenWidth]
  );
  const imageSectionHeight = useMemo(
    () => screenHeight * 0.58,
    [screenHeight]
  );
  const bottomMinHeight = useMemo(
    () => screenHeight * 0.44,
    [screenHeight]
  );

  const goToSlide = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(
        0,
        Math.min(index, ONBOARDING_SLIDES.length - 1)
      );
      flatListRef.current?.scrollToIndex({
        index: clampedIndex,
        animated: true,
      });
      activeIndexRef.current = clampedIndex;
      setActiveIndex(clampedIndex);
    },
    []
  );

  const goToNextSlide = useCallback(() => {
    const nextIndex =
      (activeIndexRef.current + 1) % ONBOARDING_SLIDES.length;
    goToSlide(nextIndex);
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

  const renderSlide = useCallback(
    ({ item }: { item: OnboardingSlide }) => (
      <Slide
        item={item}
        containerWidth={containerWidth}
        imageHeight={imageSectionHeight}
      />
    ),
    [containerWidth, imageSectionHeight]
  );

  const keyExtractor = useCallback((item: OnboardingSlide) => item.id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: containerWidth,
      offset: containerWidth * index,
      index,
    }),
    [containerWidth]
  );

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

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View
        style={[
          styles.phoneContainer,
          { width: containerWidth, height: screenHeight },
        ]}
      >
        <Pressable
          style={[styles.skipButton, { top: insets.top + 12, right: 24 }]}
          onPress={() => router.replace("/home")}
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

        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={renderSlide}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={getItemLayout}
          style={[styles.carousel, { height: imageSectionHeight }]}
          removeClippedSubviews={false}
        />

        <View
          style={[
            styles.bottomSection,
            { minHeight: bottomMinHeight },
          ]}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { fontSize: fontScale(32) }]}>
              Stop Overpaying for{"\n"}Anything
            </Text>
            <Text style={[styles.subtitle, { fontSize: fontScale(15) }]}>
              Scan any product. Expose the markup. Find it for less.
            </Text>

            <View style={styles.dotsContainer}>
              {ONBOARDING_SLIDES.map((slide, index) => (
                <Dot
                  key={slide.id}
                  index={index}
                  activeIndex={activeIndex}
                  onPress={handleDotPress}
                />
              ))}
            </View>

            <Pressable
              style={styles.ctaButton}
              onPress={() => router.replace("/home")}
            >
              <Text style={styles.ctaText}>Get Started</Text>
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
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  carousel: {},
  slideImage: {
    width: "100%",
    height: "100%",
    transform: [{ scale: 1.02 }],
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingBottom: 40,
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
    fontWeight: "700",
    lineHeight: 34.5,
    letterSpacing: -1.44,
    textAlign: "center",
    color: "#1A1A1A",
  },
  subtitle: {
    marginTop: 16,
    maxWidth: 310,
    fontWeight: "400",
    lineHeight: 23.25,
    letterSpacing: -0.15,
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
    marginTop: 32,
    height: 56,
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.16,
    color: "#FFFFFF",
  },
});
