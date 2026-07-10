import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

export const FontAssets = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
};

export const FontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extrabold: "Inter_800ExtraBold",
} as const;

export const TypeScale = {
  display: {
    fontFamily: FontFamily.extrabold,
    fontSize: 48,
    fontWeight: "800" as const,
    lineHeight: 52,
    letterSpacing: -2.4,
  },
  headingLg: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 36,
    letterSpacing: -1.44,
  },
  headingMd: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: -0.8,
  },
  sectionLg: {
    fontFamily: FontFamily.semibold,
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  sectionMd: {
    fontFamily: FontFamily.semibold,
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  bodyLg: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    fontWeight: "500" as const,
    lineHeight: 23,
    letterSpacing: -0.15,
  },
  bodyMd: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  captionLg: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    fontWeight: "500" as const,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  captionMd: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  captionSm: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    fontWeight: "500" as const,
    lineHeight: 14,
    letterSpacing: -0.1,
  },
  captionXs: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    fontWeight: "500" as const,
    lineHeight: 12,
  },
  muted: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  mutedSm: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
} as const;
