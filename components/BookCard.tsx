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
    authors?: string;
    author?: string;
    thumbnail?: string;
    cover_url?: string;
    description: string;
    categories?: string;
    published_year?: number;
  };
  content?: string;
}

type BookCardProps = {
  book: Book;
  onPress?: () => void;
  widthClass?: string; // tailwind width class override
}

export function BookCard({ book, onPress, widthClass }: BookCardProps) {
  const thumbnailUri =
    typeof book.metadata.thumbnail === 'string' && book.metadata.thumbnail
      ? book.metadata.thumbnail
      : typeof book.metadata.cover_url === 'string' && book.metadata.cover_url
      ? book.metadata.cover_url
      : '';
  const wrapClass = widthClass ?? 'w-[48%]';

  const CardContent = () => (
    <Card className="bg-gray-800 p-2 rounded-xl min-h-80 justify-between">
      <Image source={{ uri: thumbnailUri }} className="w-full h-48 rounded-lg mb-6 " alt={book.metadata.title} />
      <View className="flex flex-row items-center justify-between mb-1">
        <Text className="text-white text-xs flex-1 mr-1" numberOfLines={1} ellipsizeMode="tail">{book.metadata.authors || book.metadata.author}</Text>
        {book.metadata.published_year && (
          <Text className="text-white text-xs ml-1 shrink-0">{book.metadata.published_year}</Text>
        )}
      </View>
      <Heading size="md" className="text-white mb-4" numberOfLines={2} ellipsizeMode="tail">{book.metadata.title}</Heading>
      <HStack className="items-center">
        <Text size="sm" className="font-semibold text-info-600 no-underline">Check Book</Text>
        <Icon as={ArrowRightIcon} size="sm" className="text-info-600 mt-0.5 ml-0.5" />
      </HStack>
    </Card>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={`${wrapClass} mb-4`}>
        <CardContent />
      </Pressable>
    );
  }

  return (
    <Link href={`/book/${book.id}`} asChild>
      <Pressable className={`${wrapClass} mb-4`}>
        <CardContent />
      </Pressable>
    </Link>
  );
}