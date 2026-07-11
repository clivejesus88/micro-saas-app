import { StyleSheet, View } from "react-native";
import { usePathname, router } from "expo-router";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Home, Clock3, ScanLine, Wallet, UserRound } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useScrollContext } from "@/contexts/scroll-context";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

export type NavItem = "home" | "history" | "scan" | "vault" | "profile";

interface TabConfig {
  key: NavItem;
  label: string;
  icon: React.ElementType;
  route: string | null;
}

const TABS: TabConfig[] = [
  { key: "home", label: "Home", icon: Home, route: "/home" },
  { key: "history", label: "History", icon: Clock3, route: "/history" },
  { key: "scan", label: "Scan", icon: ScanLine, route: "/scan" },
  { key: "vault", label: "Vault", icon: Wallet, route: "/vault" },
  { key: "profile", label: "Profile", icon: UserRound, route: "/profile" },
];

const NAV_HEIGHT = 70;

export function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isNavVisible } = useScrollContext();

  const activeItem: NavItem =
    TABS.find((t) => pathname === t.route)?.key ?? "home";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          isNavVisible ? 0 : NAV_HEIGHT + insets.bottom + 40,
          { duration: 280 }
        ),
      },
    ],
    opacity: withTiming(isNavVisible ? 1 : 0, { duration: 220 }),
  }));

  const handleNavigate = (key: NavItem) => {
    const tab = TABS.find((t) => t.key === key);
    if (tab?.route) router.push(tab.route as "/home");
  };

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrapper, animatedStyle]}
    >
      <View style={styles.container}>
        <View
          style={[styles.containerInner, { paddingBottom: insets.bottom + 8 }]}
        >
          <BlurView intensity={80} tint="systemChromeMaterialLight" style={styles.blur}>
            <View style={styles.navBar}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeItem === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    style={styles.tabButton}
                    onPress={() => handleNavigate(tab.key)}
                    hitSlop={4}
                  >
                    <Icon
                      size={22}
                      color={isActive ? "#4A7A28" : "#C4C4C4"}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        { color: isActive ? "#4A7A28" : "#C4C4C4" },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </BlurView>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    paddingHorizontal: 16,
  },
  containerInner: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.6)",
  },
  blur: {
    borderRadius: 28,
    overflow: "hidden",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    height: NAV_HEIGHT,
    width: "100%",
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: NAV_HEIGHT,
  },
  tabLabel: {
    ...TypeScale.captionXs,
  },
});
