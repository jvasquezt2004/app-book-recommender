import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, TouchableOpacity, View } from 'react-native';

import { Book, BookCard } from '@/components/BookCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider, Icon, Input, InputField, InputIcon, SearchIcon } from '@gluestack-ui/themed';
import { router } from 'expo-router';

// Configuración de la API
const API_HOST = '192.168.23.152'; // IP de la computadora en la red local
const API_PORT = '8000';
const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;

export default function ExploreScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Function to fetch random books
  const fetchRandomBooks = async () => {
    try {
      setIsLoading(true);
      setIsSearchMode(false);
      
      // Most reliable approach: get a set of books and shuffle client-side
      const { data, error } = await supabase
        .from('documents')
        .select('id, metadata')
        .limit(50); // Get a batch of books to shuffle
      
      if (error) {
        console.error('Error fetching books:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Shuffle the array and take the first 6 items
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const sixBooks = shuffled.slice(0, 6);
        console.log('Number of books fetched:', sixBooks.length);
        setBooks(sixBooks);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Exception fetching random books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para buscar libros usando la API
  const searchBooksAPI = async (query: string) => {
    try {
      setIsLoading(true);
      setIsSearchMode(true);
      
      // URL de la API usando la configuración
      const apiUrl = `${API_BASE_URL}/search`;
      
      // Añadir parámetros de búsqueda a la URL
      const url = new URL(apiUrl);
      url.searchParams.append('query', query);
      url.searchParams.append('limit', '10');
      url.searchParams.append('offset', '0');
      
      console.log('Fetching from API:', url.toString());
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      
      if (data.results && data.results.length > 0) {
        // Transformar los resultados al formato esperado por BookCard
        const formattedBooks = data.results.map((item: { uuid: string; metadata: any }) => ({
          id: item.uuid,
          metadata: item.metadata
        }));
        setBooks(formattedBooks);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error al buscar libros:', error);
      Alert.alert(
        'Error de búsqueda',
        'No se pudieron obtener resultados. Verifique que la API esté en funcionamiento.'
      );
      // Si falla la búsqueda, cargar libros aleatorios
      fetchRandomBooks();
    } finally {
      setIsLoading(false);
    }
  };

  // Load random books when component mounts
  useEffect(() => {
    fetchRandomBooks();
  }, []);

  // Function to handle book selection
  const handleBookSelect = (book: Book) => {
    // Navigate to book details page with the selected book
    console.log('Navigating to book:', book.id);
    try {
      // Try the simplest approach
      router.push(`/(modals)/book/${book.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Function to handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      searchBooksAPI(searchQuery.trim());
    } else {
      // Si la consulta está vacía, mostrar libros aleatorios
      fetchRandomBooks();
    }
  };

  return (
    <GluestackUIProvider config={config}>
      <ThemedView className="flex-1 px-4 pt-12 pb-4">
        <ThemedView className="flex-row mb-5">
          <ThemedText className="text-2xl font-bold">Explore</ThemedText>
        </ThemedView>
        <View className="flex-1">
          <View className="mb-4">
            <View className="flex-row">
              <Input
                variant="outline"
                size="md"
                width="85%"
                className="mr-2"
              >
                <InputField
                  placeholder="Search books..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                />
                <InputIcon>
                  <Icon as={SearchIcon} mr="$2" />
                </InputIcon>
              </Input>
              <TouchableOpacity 
                className="bg-blue-600 rounded px-4 py-2 justify-center" 
                onPress={handleSearch}
              >
                <ThemedText className="text-white font-medium">Search</ThemedText>
              </TouchableOpacity>
            </View>
            {isSearchMode && (
              <TouchableOpacity 
                className="mt-2" 
                onPress={() => {
                  setSearchQuery('');
                  fetchRandomBooks();
                }}
              >
                <ThemedText className="text-blue-500">← Volver a libros aleatorios</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View className="flex-1">
              {books.length > 0 ? (
                <FlatList
                  data={books}
                  renderItem={({ item }) => (
                    <BookCard
                      book={item}
                      onPress={handleBookSelect}
                    />
                  )}
                  keyExtractor={item => item.id}
                  numColumns={2}
                  initialNumToRender={6}
                  maxToRenderPerBatch={6}
                  columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
                  style={{ height: 'auto' }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              ) : (
                <ThemedText className="text-center text-lg mt-8">
                  No books found. Try a different search.
                </ThemedText>
              )}
            </View>
          )}
        </View>
      </ThemedView>
    </GluestackUIProvider>
  );
}

