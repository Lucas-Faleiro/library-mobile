import { Book } from "@/types/books";
import { useQuery } from "@tanstack/react-query";

const useGetBookByIsbn = (isbn: string) => {
  return useQuery({
    queryKey: ["get-book-isbn", isbn],
    enabled: !!isbn,
    queryFn: async (): Promise<Book> => {
      const url = `https://openlibrary.org/search.json?isbn=${isbn}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Library-mobile (lucas.faleirosilva@gmail.com)",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch book");
      }

      const data = await response.json();
      const doc = data.docs?.[0];

      if (!doc) {
        throw new Error("Book not found");
      }

      return {
        isbn,
        title: doc.title,
        authors: doc.author_name ?? [],
        coverUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          : undefined,
      };
    },
  });
};

export default useGetBookByIsbn;
