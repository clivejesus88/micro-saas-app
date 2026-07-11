import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Camera } from "lucide-react-native";
import { MAX_WIDTH, BOTTOM_NAV_HEIGHT } from "@/constants/layout";
import { useScrollContext } from "@/contexts/scroll-context";
import { TypeScale } from "@/constants/typography";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex@email.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const {
    onScrollBeginDrag,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useScrollContext();

  const bottomSpacer = BOTTOM_NAV_HEIGHT + insets.bottom + 20;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomSpacer },
        ]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>AR</Text>
          </View>
          <Pressable style={styles.cameraButton}>
            <Camera size={18} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#BBBBBB"
            />
          </View>
          <View style={styles.fieldDivider} />
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.fieldInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#BBBBBB"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.fieldDivider} />
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              style={styles.fieldInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#BBBBBB"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveWrapper}>
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: -0.4,
    color: "#1A1A1A",
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 24,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#2D4A1E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cameraButton: {
    position: "absolute",
    top: 70,
    left: "55%",
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF6B1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  changePhotoText: {
    ...TypeScale.captionMd,
    fontWeight: "500",
    color: "#4A7A28",
    marginTop: 10,
  },
  formCard: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 3,
    overflow: "hidden",
  },
  fieldGroup: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fieldLabel: {
    ...TypeScale.captionSm,
    fontWeight: "500",
    color: "#888888",
    marginBottom: 6,
  },
  fieldInput: {
    ...TypeScale.bodyLg,
    color: "#1A1A1A",
    padding: 0,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 16,
  },
  saveWrapper: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  saveButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
