import { useWindowDimensions } from "react-native";

const BASELINE_WIDTH = 390;

export function useResponsive() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const isSmallScreen = screenWidth < 375;
  const isLargeScreen = screenWidth > 430;

  const scale = (value: number): number => {
    return Math.round((screenWidth / BASELINE_WIDTH) * value);
  };

  const fontScale = (value: number): number => {
    const scaled = (screenWidth / BASELINE_WIDTH) * value;
    const min = value * 0.85;
    const max = value * 1.15;
    return Math.round(Math.min(Math.max(scaled, min), max));
  };

  const maxContentWidth = Math.min(screenWidth, 430);

  return {
    screenWidth,
    screenHeight,
    isSmallScreen,
    isLargeScreen,
    scale,
    fontScale,
    maxContentWidth,
  };
}
