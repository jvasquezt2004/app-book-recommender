import React from 'react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// Book type definition based on your Supabase structure
export type Book = {
  id: string;
  metadata: {
    title: string;
    authors: string;
    thumbnail: string;
    description: string;
    categories?: string;
    published_year?: number;
  };
  content?: string; // Book content/summary text
};

type BookCardProps = {
  book: Book;
  onPress: (book: Book) => void;
};

export const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  return (
    <Link
      href={{
        pathname: '/(modals)/book/[id]',
        params: { id: book.id }
      }}
      asChild
    >
      <ThemedView 
        className="w-[48%] mb-4"
        onTouchEnd={() => {
          // Still call the onPress handler for any additional logic
          onPress(book);
        }}
      >
        <ThemedView className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
          <Image
            source={{ uri: book.metadata.thumbnail || 'https://via.placeholder.com/300x450?text=No+Cover' }}
            style={{ width: '100%', height: 160, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
            contentFit="cover"
            transition={300}
          />
          <ThemedView className="p-3">
            <ThemedText className="font-bold mb-1 text-sm" numberOfLines={2}>
              {book.metadata.title}
            </ThemedText>
            <ThemedText className="text-xs text-gray-600 dark:text-gray-300 mb-1" numberOfLines={1}>
              {book.metadata.authors}
            </ThemedText>
            {book.metadata.published_year && (
              <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
                {book.metadata.published_year}
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Link>
  );
};
