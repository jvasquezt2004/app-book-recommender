import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { ArrowRightIcon, Icon } from "./ui/icon";
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
    <Link href={`/book/${book.id}`} asChild>
    <Pressable className="w-[48%] mb-4"> 
    <Card className="bg-gray-800 p-2 rounded-xl min-h-80 justify-between">
      <Image source={{ uri: book.metadata.thumbnail }} className="w-full h-48 rounded-lg mb-6 " alt={book.metadata.title} />
      <View className="flex flex-row justify-between">
        <Text className="text-white text-sm mb-2">{book.metadata.authors}</Text>
        {book.metadata.published_year && (
          <Text className="text-white text-sm mb-2">{book.metadata.published_year}</Text>
        )}
      </View>
      <Heading size="md" className="text-white mb-4" numberOfLines={2} ellipsizeMode="tail">{book.metadata.title}</Heading>
      <HStack className="items-center">
        <Text size="sm" className="font-semibold text-info-600 no-underline">Check Book</Text>
        <Icon as={ArrowRightIcon} size="sm" className="text-info-600 mt-0.5 ml-0.5" />
      </HStack>
    </Card>
    </Pressable>
    </Link>
  )
}