import { Pressable, View } from "react-native";
import { Image } from "./ui/image";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Icon, ArrowRightIcon } from "./ui/icon";
import { Book } from "./BookCard";

interface Props {
  book: Book;
  onPress?: () => void;
}

export default function BookOfDayCard({ book, onPress }: Props) {
  const thumbnailUri =
    typeof book.metadata.thumbnail === "string" && book.metadata.thumbnail
      ? book.metadata.thumbnail
      : typeof book.metadata.cover_url === "string" && book.metadata.cover_url
      ? book.metadata.cover_url
      : "";

  const contentPreview = book.content?.slice(0, 120) || book.metadata.description?.slice(0, 120) || "";

  const Inner = () => (
    <Card className="bg-gray-800 p-4 rounded-xl flex-row w-full">
      {/* Left */}
      <View className="items-center w-32 mr-4">
        <Image source={{ uri: thumbnailUri }} className="w-32 h-48 rounded-lg mb-2" alt={book.metadata.title} />
        <HStack className="items-center">
          <Text size="sm" className="font-semibold text-info-600 no-underline">Check Book</Text>
          <Icon as={ArrowRightIcon} size="sm" className="text-info-600 mt-0.5 ml-0.5" />
        </HStack>
      </View>
      {/* Right */}
      <View className="flex-1">
        <Heading size="md" className="text-white mb-2" numberOfLines={2} ellipsizeMode="tail">
          {book.metadata.title}
        </Heading>
        { (book.metadata.authors || book.metadata.author) && (
          <Text className="text-white mb-1">{book.metadata.authors || book.metadata.author}</Text>
        )}
        {book.metadata.published_year && (
          <Text className="text-white mb-1">{book.metadata.published_year}</Text>
        )}
        {contentPreview && (
          <Text className="text-gray-200 text-sm" numberOfLines={4} ellipsizeMode="tail">
            {contentPreview}...
          </Text>
        )}
      </View>
    </Card>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="w-full mb-4">
        <Inner />
      </Pressable>
    );
  }
  return <Inner />;
}
