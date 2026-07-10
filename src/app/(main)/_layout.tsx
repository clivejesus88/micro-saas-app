import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { BottomNav } from "@/components/bottom-nav";
import { ScrollProvider } from "@/contexts/scroll-context";

export default function MainLayout() {
  return (
    <ScrollProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>
        <BottomNav />
      </View>
    </ScrollProvider>
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
