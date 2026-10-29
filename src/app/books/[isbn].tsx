import useGetBookByIsbn from "@/services/useGetBookByIsbn";
import { SafeAreaView } from "@/ui";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Text, View } from "react-native";

function BookDetails() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { data: book, isLoading, isError } = useGetBookByIsbn(isbn);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  if (isError || !book) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="text-base font-medium text-slate-500">
          Could not load book details.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
      <View className="w-full max-w-sm items-center rounded-3xl bg-white p-8 shadow-sm">
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
            className="h-72 w-48 rounded-2xl bg-slate-200"
            resizeMode="cover"
          />
        ) : (
          <View className="h-72 w-48 items-center justify-center rounded-2xl bg-slate-100">
            <Text className="text-sm text-slate-400">No Cover</Text>
          </View>
        )}

        <Text className="mt-6 text-center text-2xl font-bold text-slate-900">
          {book.title}
        </Text>

        <Text className="mt-2 text-center text-base font-medium text-indigo-600">
          {book.authors.join(", ")}
        </Text>

        <View className="mt-6 rounded-full bg-slate-100 px-4 py-1.5">
          <Text className="text-xs font-semibold tracking-wider text-slate-500">
            ISBN {book.isbn}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default BookDetails;
