import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { BottomNav } from "@/components/bottom-nav";
import { ScrollProvider } from "@/contexts/scroll-context";
import { UserProvider } from "@/contexts/user-context";

export default function MainLayout() {
  return (
    <UserProvider>
      <ScrollProvider>
        <View style={styles.container}>
          <View style={styles.content}>
            <Slot />
          </View>
          <BottomNav />
        </View>
      </ScrollProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
});
