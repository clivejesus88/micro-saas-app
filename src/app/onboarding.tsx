import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_WIDTH = 430;
const CONTAINER_WIDTH = Math.min(SCREEN_WIDTH, MAX_WIDTH);
const IMAGE_SECTION_HEIGHT = SCREEN_HEIGHT * 0.58;
const BOTTOM_MIN_HEIGHT = SCREEN_HEIGHT * 0.44;

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

function Slide({ item }: { item: OnboardingSlide }) {
  return (
    <View style={{ width: CONTAINER_WIDTH, height: IMAGE_SECTION_HEIGHT }}>
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

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{ index: number | null }>;
    }) => {
      const index = viewableItems[0]?.index;
      if (index !== null && index !== undefined) {
        setActiveIndex(index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderSlide = useCallback(
    ({ item }: { item: OnboardingSlide }) => <Slide item={item} />,
    []
  );

  const keyExtractor = useCallback((item: OnboardingSlide) => item.id, []);

  const handleDotPress = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={styles.phoneContainer}>
        <Pressable
          style={styles.skipButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.skipText}>Skip</Text>
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
          style={styles.carousel}
        />

        <View style={styles.bottomSection}>
          <View style={styles.content}>
            <Text style={styles.title}>
              Stop Overpaying for Anything
            </Text>
            <Text style={styles.subtitle}>
              Scan any product. Expose the markup. Find it for less.
            </Text>

            <View style={styles.dotsContainer}>
              {ONBOARDING_SLIDES.map((slide, index) => (
                <Pressable
                  key={slide.id}
                  onPress={() => handleDotPress(index)}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        activeIndex === index ? "#FF6B1A" : "#D8D8D8",
                    },
                  ]}
                />
              ))}
            </View>

            <Pressable
              style={styles.ctaButton}
              onPress={() => router.replace("/")}
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
    width: CONTAINER_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    position: "relative",
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 30,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888888",
    letterSpacing: 0,
  },
  carousel: {
    height: IMAGE_SECTION_HEIGHT,
  },
  slideImage: {
    width: "100%",
    height: "100%",
    transform: [{ scale: 1.02 }],
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: BOTTOM_MIN_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 32,
    justifyContent: "flex-end",
  },
  content: {
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 34.5,
    letterSpacing: -1.44,
    textAlign: "center",
    color: "#1A1A1A",
  },
  subtitle: {
    marginTop: 16,
    maxWidth: 310,
    fontSize: 15,
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
    width: 8,
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
