import { Alert } from "react-native";
import { usePathname, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { House, Clock, Shield, User, Scan } from "lucide-react-native";

type NavItem = "home" | "history" | "scan" | "vault" | "profile";

interface TabConfig {
  key: NavItem;
  label: string;
  icon: React.ElementType;
  route: string;
}

const TABS: TabConfig[] = [
  { key: "home", label: "Home", icon: House, route: "/home" },
  { key: "history", label: "History", icon: Clock, route: "/history" },
  { key: "vault", label: "Vault", icon: Shield, route: "/vault" },
  { key: "profile", label: "Profile", icon: User, route: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const activeItem: NavItem =
    TABS.find((t) => pathname === t.route)?.key ?? "home";

  const handleNavigate = (key: NavItem) => {
    if (key === "scan") {
      Alert.alert("Scanner", "Camera scanner coming soon");
      return;
    }
    const tab = TABS.find((t) => t.key === key);
    if (tab) router.push(tab.route);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.navBar}>
        {TABS.slice(0, 2).map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            isActive={activeItem === tab.key}
            onPress={() => handleNavigate(tab.key)}
          />
        ))}

        <View style={styles.fabWrapper}>
          <Pressable style={styles.fab} onPress={() => handleNavigate("scan")}>
            <Scan size={22} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>

        {TABS.slice(2).map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            isActive={activeItem === tab.key}
            onPress={() => handleNavigate(tab.key)}
          />
        ))}
      </View>
    </View>
  );
}

function TabButton({
  tab,
  isActive,
  onPress,
}: {
  tab: TabConfig;
  isActive: boolean;
  onPress: () => void;
}) {
  const Icon = tab.icon;
  return (
    <Pressable style={styles.tabButton} onPress={onPress}>
      <Icon
        size={22}
        color={isActive ? "#4A7A28" : "#C4C4C4"}
        strokeWidth={isActive ? 2.5 : 1.8}
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
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    width: "100%",
    maxWidth: 430,
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 72,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 12,
  },
  fabWrapper: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    height: 72,
  },
  fab: {
    position: "absolute",
    top: -27,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1C2A0E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});
