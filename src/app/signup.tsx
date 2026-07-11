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
import {
  Apple,
  Check,
  CircleCheck,
  ChevronLeft,
  Eye,
  Gem,
  Lock,
  Mail,
  UserRound,
} from "lucide-react-native";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

type FocusedField = "name" | "email" | "password" | "confirm" | null;

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const passwordStrength = getPasswordStrength(password);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </Pressable>

        <Gem size={36} color="#FF6B1A" strokeWidth={2.25} />
        <Text style={styles.brandName}>Fringe</Text>
        <Text style={styles.brandTagline}>Your arbitrage advantage.</Text>
      </View>

      {/* Form Section */}
      <ScrollView
        style={styles.formSection}
        contentContainerStyle={[
          styles.formContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formTitle}>Create Account</Text>
        <Text style={styles.formSubtitle}>
          Join thousands saving on every purchase.
        </Text>

        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "name" && styles.inputWrapperFocused,
            ]}
          >
            <UserRound size={18} color="#AAAAAA" strokeWidth={1.8} />
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              placeholder="Your full name"
              placeholderTextColor="#BBBBBB"
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "email" && styles.inputWrapperFocused,
            ]}
          >
            <Mail size={18} color="#AAAAAA" strokeWidth={1.8} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="you@email.com"
              placeholderTextColor="#BBBBBB"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "password" && styles.inputWrapperFocused,
            ]}
          >
            <Lock size={18} color="#AAAAAA" strokeWidth={1.8} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="Create a password"
              placeholderTextColor="#BBBBBB"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={8}
            >
              <Eye size={18} color="#AAAAAA" strokeWidth={1.8} />
            </Pressable>
          </View>

          {/* Strength Bar */}
          <View style={styles.strengthBar}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.strengthSegment,
                  i < passwordStrength.filled &&
                    styles.strengthSegmentFilled,
                ]}
              />
            ))}
          </View>
          <Text style={styles.strengthLabel}>{passwordStrength.label}</Text>
        </View>

        {/* Confirm Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Confirm Password</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "confirm" && styles.inputWrapperFocused,
            ]}
          >
            <Lock size={18} color="#AAAAAA" strokeWidth={1.8} />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              placeholder="Repeat your password"
              placeholderTextColor="#BBBBBB"
              secureTextEntry
              autoCapitalize="none"
            />
            {confirmPassword.length > 0 && confirmPassword === password && (
              <CircleCheck size={18} color="#4A7A28" strokeWidth={1.8} />
            )}
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsRow}>
          <Pressable
            style={[
              styles.checkbox,
              agreedToTerms && styles.checkboxChecked,
            ]}
            onPress={() => setAgreedToTerms((v) => !v)}
          >
            {agreedToTerms && <Check size={11} color="#FFFFFF" strokeWidth={4} />}
          </Pressable>
          <Text style={styles.termsText}>
            I agree to the{" "}
            <Text style={styles.termsLink}>Terms</Text>
            {" "}and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>

        {/* Create Account */}
        <Pressable style={styles.createButton} onPress={() => {}}>
          <Text style={styles.createText}>Create Account</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or sign up with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialButton}>
            <View style={styles.googleIcon}>
              <View style={[styles.googleQuad, { top: 0, left: 0, backgroundColor: "#4285F4" }]} />
              <View style={[styles.googleQuad, { top: 0, right: 0, backgroundColor: "#34A853" }]} />
              <View style={[styles.googleQuad, { bottom: 0, left: 0, backgroundColor: "#FBBC05" }]} />
              <View style={[styles.googleQuad, { bottom: 0, right: 0, backgroundColor: "#EA4335" }]} />
            </View>
            <Text style={styles.socialText}>Google</Text>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Apple size={20} color="#1A1A1A" strokeWidth={1.8} />
            <Text style={styles.socialText}>Apple</Text>
          </Pressable>
        </View>

        {/* Sign In */}
        <View style={styles.signinRow}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.signinLink}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function getPasswordStrength(pw: string): { filled: number; label: string } {
  if (pw.length === 0) return { filled: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { filled: 1, label: "Weak" };
  if (score === 2) return { filled: 2, label: "Medium" };
  if (score === 3) return { filled: 3, label: "Strong" };
  return { filled: 4, label: "Very Strong" };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    backgroundColor: "#1C2A0E",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 36,
    letterSpacing: -0.96,
    color: "#FFFFFF",
    marginTop: 12,
  },
  brandTagline: {
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
  },

  // Form
  formSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: -0.52,
    color: "#1A1A1A",
  },
  formSubtitle: {
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "#888888",
    marginTop: 4,
  },

  // Fields
  fieldGroup: {
    marginTop: 16,
  },
  fieldLabel: {
    ...TypeScale.captionLg,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: "#4A7A28",
  },
  input: {
    flex: 1,
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "#1A1A1A",
    padding: 0,
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  // Strength
  strengthBar: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
    height: 4,
  },
  strengthSegment: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: "#F0F0F0",
  },
  strengthSegmentFilled: {
    backgroundColor: "#4A7A28",
  },
  strengthLabel: {
    ...TypeScale.captionSm,
    fontWeight: "500",
    color: "#4A7A28",
    textAlign: "right",
    marginTop: 4,
  },

  // Terms
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 16,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: "#4A7A28",
    borderColor: "#4A7A28",
  },
  termsText: {
    ...TypeScale.captionLg,
    fontWeight: "400",
    color: "#888888",
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: "500",
    color: "#FF6B1A",
  },

  // Create Account
  createButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  createText: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F2F2F2",
  },
  dividerText: {
    ...TypeScale.captionLg,
    fontWeight: "400",
    color: "#AAAAAA",
  },

  // Social
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  socialButton: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
  },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 3,
    overflow: "hidden",
  },
  googleQuad: {
    position: "absolute",
    width: 9,
    height: 9,
  },
  socialText: {
    ...TypeScale.bodyMd,
    fontWeight: "500",
    color: "#1A1A1A",
  },

  // Sign In
  signinRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingBottom: 24,
  },
  signinText: {
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "#888888",
  },
  signinLink: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#4A7A28",
  },
});
