import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Apple,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react-native";
import { MAX_WIDTH } from "@/constants/layout";
import { TypeScale } from "@/constants/typography";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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

        <View style={styles.logoMark}>
          <View style={styles.logoInner} />
        </View>

        <Text style={styles.brandName}>Fringe</Text>
        <Text style={styles.brandTagline}>Your arbitrage advantage.</Text>
      </View>

      {/* Form Section */}
      <View style={[styles.formSection, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.formInner}>
          <View>
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSubtitle}>Sign in to continue.</Text>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View
              style={[
                styles.inputWrapper,
                isEmailFocused && styles.inputWrapperFocused,
              ]}
            >
              <Mail size={18} color="#AAAAAA" strokeWidth={1.8} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
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
                isPasswordFocused && styles.inputWrapperFocused,
              ]}
            >
              <Lock size={18} color="#AAAAAA" strokeWidth={1.8} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="Enter your password"
                placeholderTextColor="#BBBBBB"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="current-password"
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#AAAAAA" strokeWidth={1.8} />
                ) : (
                  <Eye size={18} color="#AAAAAA" strokeWidth={1.8} />
                )}
              </Pressable>
            </View>
            <Pressable style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* Sign In */}
          <Pressable style={styles.signInButton} onPress={() => router.replace("/home")}>
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
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
              <Apple size={18} color="#1A1A1A" strokeWidth={1.8} />
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>

          {/* Sign Up */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    backgroundColor: "#1C2A0E",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
    paddingBottom: 36,
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
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#FF6B1A",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
    marginBottom: 20,
    marginTop: 20,
  },
  logoInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  brandName: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 36,
    letterSpacing: -0.96,
    color: "#FFFFFF",
  },
  brandTagline: {
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "rgba(255,255,255,0.6)",
    marginTop: 12,
  },

  // Form Section
  formSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
  },
  formInner: {
    flex: 1,
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
    marginTop: 20,
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
  forgotRow: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    ...TypeScale.captionLg,
    fontWeight: "500",
    color: "#FF6B1A",
  },

  // Sign In
  signInButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1C2A0E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  signInText: {
    ...TypeScale.bodyLg,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F0F0F0",
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
    gap: 8,
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

  // Sign Up
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingBottom: 24,
  },
  signupText: {
    ...TypeScale.bodyMd,
    fontWeight: "400",
    color: "#888888",
  },
  signupLink: {
    ...TypeScale.bodyMd,
    fontWeight: "600",
    color: "#4A7A28",
  },
});
