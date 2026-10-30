import { SafeAreaView } from "@/ui";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { type BarcodeScanningResult } from "expo-camera";
import { Dimensions, type LayoutChangeEvent, Text, View } from "react-native";

export const SCAN_BOX_WIDTH = 280;
export const SCAN_BOX_HEIGHT = 160;
const BOUNDS_TOLERANCE = 16;

let overlayDimensions = Dimensions.get("window");

export function isBarcodeInsideScanBox(result: BarcodeScanningResult): boolean {
  const { width: containerWidth, height: containerHeight } = overlayDimensions;
  const boxLeft = (containerWidth - SCAN_BOX_WIDTH) / 2;
  const boxTop = (containerHeight - SCAN_BOX_HEIGHT) / 2;
  const boxRight = boxLeft + SCAN_BOX_WIDTH;
  const boxBottom = boxTop + SCAN_BOX_HEIGHT;

  const { bounds, cornerPoints } = result;

  if (
    bounds &&
    (bounds.origin.x !== 0 ||
      bounds.origin.y !== 0 ||
      bounds.size.width !== 0 ||
      bounds.size.height !== 0)
  ) {
    const { origin, size } = bounds;
    const centerX = origin.x + size.width / 2;
    const centerY = origin.y + size.height / 2;

    const isCenterInside =
      centerX >= boxLeft &&
      centerX <= boxRight &&
      centerY >= boxTop &&
      centerY <= boxBottom;

    const isBoundsInside =
      origin.x >= boxLeft - BOUNDS_TOLERANCE &&
      origin.x + size.width <= boxRight + BOUNDS_TOLERANCE &&
      origin.y >= boxTop - BOUNDS_TOLERANCE &&
      origin.y + size.height <= boxBottom + BOUNDS_TOLERANCE;

    return isCenterInside && isBoundsInside;
  }

  if (cornerPoints && cornerPoints.length > 0) {
    return cornerPoints.every(
      (point) =>
        point.x >= boxLeft - BOUNDS_TOLERANCE &&
        point.x <= boxRight + BOUNDS_TOLERANCE &&
        point.y >= boxTop - BOUNDS_TOLERANCE &&
        point.y <= boxBottom + BOUNDS_TOLERANCE,
    );
  }

  return true;
}

export default function CameraOverlay() {
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    overlayDimensions = { ...overlayDimensions, width, height };
  };

  return (
    <SafeAreaView className="absolute inset-0" pointerEvents="none">
      <View className="flex-1" onLayout={handleLayout}>
        {/* Top dimmed area */}
        <View className="flex-1 items-center justify-end bg-black/65 px-6 pb-8">
          <Text className="text-lg font-semibold text-white">
            Escaneie o código de barras do livro
          </Text>
        </View>

        {/* Middle row with transparent barcode cutout */}
        <View className="flex-row" style={{ height: SCAN_BOX_HEIGHT }}>
          <View className="flex-1 bg-black/65" />

          <View
            style={{ width: SCAN_BOX_WIDTH, height: SCAN_BOX_HEIGHT }}
            className="relative items-center justify-center"
          >
            {/* Subtle full frame border */}
            <View className="absolute inset-0 rounded-2xl border border-white/20" />

            {/* Corner brackets */}
            <View className="absolute top-0 left-0 h-7 w-7 rounded-tl-2xl border-t-4 border-l-4 border-indigo-400" />
            <View className="absolute top-0 right-0 h-7 w-7 rounded-tr-2xl border-t-4 border-r-4 border-indigo-400" />
            <View className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-2xl border-b-4 border-l-4 border-indigo-400" />
            <View className="absolute right-0 bottom-0 h-7 w-7 rounded-br-2xl border-r-4 border-b-4 border-indigo-400" />

            {/* Horizontal scan line */}
            <View className="h-0.5 w-5/6 rounded-full bg-indigo-400/80" />
          </View>

          <View className="flex-1 bg-black/65" />
        </View>

        {/* Bottom dimmed area */}
        <View className="flex-1 items-center bg-black/65 px-6 pt-8">
          <View className="flex-row items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Ionicons name="barcode-outline" size={18} color="white" />
            <Text className="text-xs font-medium tracking-wider text-white/90">
              EAN-13 / ISBN
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
