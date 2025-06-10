import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { Book } from '@/components/BookCard';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'summary'>('details');

  useEffect(() => {
    // Fetch book details when id changes
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  const fetchBook = async (bookId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', bookId)
        .single();

      if (error) {
        console.error('Error fetching book:', error);
        setError('Failed to load book details');
        return;
      }

      if (data) {
        setBook(data as Book);
      } else {
        setError('Book not found');
      }
    } catch (err) {
      console.error('Exception fetching book:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText className="mt-4 text-center">Loading book details...</ThemedText>
      </View>
    );
  }

  if (error || !book) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <ThemedText className="text-red-500 text-center text-lg">{error || 'Book not found'}</ThemedText>
        <TouchableOpacity 
          className="mt-4 bg-blue-600 py-2 px-4 rounded" 
          onPress={() => router.back()}
        >
          <ThemedText className="text-white">Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Stack.Screen 
        options={{ 
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
      
      <ThemedView className="bg-blue-600 dark:bg-blue-800 px-4 pt-12 pb-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-4"
        >
          <IconSymbol 
            name="chevron.left"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <ThemedText className="text-white text-xl font-bold">Book Details</ThemedText>
      </ThemedView>
      
      <ThemedView className="items-center p-5 bg-gray-100 dark:bg-gray-800">
        <Image
          source={{ uri: book.metadata.thumbnail || 'https://via.placeholder.com/300x450?text=No+Cover' }}
          style={{ width: 200, height: 300, borderRadius: 8 }}
          contentFit="cover"
          transition={300}
        />
        <ThemedText className="mt-4 text-xl font-bold text-center">{book.metadata.title}</ThemedText>
        <ThemedText className="text-gray-600 dark:text-gray-300 mt-1">
          by {book.metadata.authors}
        </ThemedText>
        {book.metadata.published_year && (
          <ThemedText className="text-gray-500 dark:text-gray-400 mt-1">
            Published: {book.metadata.published_year}
          </ThemedText>
        )}
      </ThemedView>
      
      <ThemedView className="flex-row border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity 
          className={`flex-1 py-3 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('details')}
        >
          <ThemedText className={`text-center font-medium ${activeTab === 'details' ? 'text-blue-500' : ''}`}>
            Details
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 ${activeTab === 'summary' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('summary')}
        >
          <ThemedText className={`text-center font-medium ${activeTab === 'summary' ? 'text-blue-500' : ''}`}>
            Summary
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <View className="flex-1 px-4">
        {activeTab === 'details' ? (
          <ThemedView className="p-4">
            {book.metadata.categories && (
              <View className="mb-4">
                <ThemedText className="font-bold mb-1">Categories:</ThemedText>
                <ThemedText>{book.metadata.categories}</ThemedText>
              </View>
            )}
            <ThemedText className="font-bold mb-1">Description:</ThemedText>
            <ThemedText>{book.metadata.description}</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView className="p-4">
            <ThemedText className="font-bold mb-1">Content Summary:</ThemedText>
            <ThemedText>
              {book.content || 'No summary available for this book.'}
            </ThemedText>
          </ThemedView>
        )}
      </View>
    </View>
  );
}
