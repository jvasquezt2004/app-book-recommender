import { Link } from "expo-router";
import { View } from "react-native";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Image } from "./ui/image";
import { Text } from "./ui/text";

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
  content?: string;
}

type BookCardProps = {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="w-[48%] mb-4 bg-gray-800 p-2 rounded-xl">
      <Image source={{ uri: book.metadata.thumbnail }} className="w-full h-48 rounded-lg mb-6 " alt={book.metadata.title} />
      <View className="flex flex-row justify-between">
        <Text className="text-white text-sm mb-2 text-typography-700">{book.metadata.authors}</Text>
        {book.metadata.published_year && (
          <Text className="text-white text-sm mb-2 text-typography-700">{book.metadata.published_year}</Text>
        )}
      </View>
      <Heading size="md" className="text-white mb-4">{book.metadata.title}</Heading>
      <HStack>
        <Link href={`/book/${book.id}`}>
          <Text className="text-white text-sm mb-2 text-typography-700">Read</Text>
        </Link>
      </HStack>
    </Card>
  )
}