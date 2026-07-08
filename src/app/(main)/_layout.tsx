import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { BottomNav } from "@/components/bottom-nav";

export default function MainLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <BottomNav />
    </View>
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
