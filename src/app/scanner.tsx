import { CameraView, SafeAreaView } from "@/ui";
import { useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = permission?.granted;

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  return (
    <SafeAreaView className="flex-1">
      <CameraView
        className="flex-1"
        facing="back"
        onBarcodeScanned={(data) => router.replace(`/books/${data.data}`)}
        barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
      />
    </SafeAreaView>
  );
}
