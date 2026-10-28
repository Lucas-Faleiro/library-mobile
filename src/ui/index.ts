import { CameraView as ExpoCameraView } from "expo-camera";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

export const SafeAreaView = withUniwind(RNSafeAreaView);
export const CameraView = withUniwind(ExpoCameraView);
