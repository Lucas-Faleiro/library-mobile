import { SafeAreaView } from "@/ui";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { router } from "expo-router";
import { Pressable } from "react-native";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
      <Pressable
        onPress={() => router.push("/scanner")}
        className="h-28 w-28 items-center justify-center rounded-3xl bg-indigo-600 shadow-lg active:scale-95 active:opacity-80"
      >
        <Ionicons name="camera" size={50} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
