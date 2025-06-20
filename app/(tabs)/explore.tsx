import { Book, BookCard } from "@/components/BookCard";
import { BookDetailModal } from "@/components/BookDetailModal";
import { ThemedView } from "@/components/ThemedView";
import { Button, ButtonIcon } from "@/components/ui/button";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { API_BASE_URL } from "@/constants/api";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";

export default function ExploreScreen() {
    const [books, setBooks] = useState<Book[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)

    const fetchRandomBooks = async () => {
        let supaError: any = null;
        try {
            setIsLoading(true)
            setIsSearchMode(false)
            
            const { data, error } = await supabase
                .from('documents')
                .select('id, metadata, content')
                .limit(50)

            if (error) {
                supaError = error;
                console.error('Supabase error fetching books:', error)
                setIsLoading(false)
                return
            }

            if (data && data.length > 0) {
                const shuffled = [...data].sort(() => 0.5 - Math.random())
                const tenBooks = shuffled.slice(0, 10)
                console.log(tenBooks)
                setBooks(tenBooks)
            } else {
                setBooks([])
            }
        } catch (error) {
            console.error('Exception (network?) fetching books:', error);
            if (supaError) {
              console.log('Supabase error object →', JSON.stringify(supaError, null, 2));
            }
            console.error('Exception fetching books:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const searchBooksAI = async (query: string) => {
        let urlUsed: string = '';
        try {
            setIsLoading(true)
            setIsSearchMode(true)
            
            const apiUrl = `${API_BASE_URL}/search`

            const urlObj = new URL(apiUrl)
            urlObj.searchParams.append('query', query)
            urlObj.searchParams.append('limit', '10')
            urlObj.searchParams.append('offset', '0')
            
            urlUsed = urlObj.toString();
            console.log('Fetching books from API:', urlUsed)

            const response = await fetch(urlUsed)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('Books fetched from API:', data)

            if (data.results && data.results.length > 0) {
                const formattedBooks = data.results.map((item: {uuid: string, metadata: any, content?: string}) => ({
                    id: item.uuid,
                    metadata: item.metadata,
                    content: item.content || ''
                }))
                console.log('Formatted books:', formattedBooks)
                setBooks(formattedBooks)
            } else {
                setBooks([])
            }
        } catch (error: any) {
            console.error('Exception fetching books:', error);
            console.log('URL used →', urlUsed);
            try {
                console.log('Fetch error →', JSON.stringify(error, null, 2));
            } catch {}
            fetchRandomBooks();
        } finally {
            setIsLoading(false)
        }
    }

    const handleAISearch = () => {
        if (searchQuery.trim()) {
            searchBooksAI(searchQuery)
        } else {
            fetchRandomBooks()
        }
    }

    useEffect(() => {
        fetchRandomBooks()
    }, [])

    // Connectivity test: check direct fetch to Supabase and generic HTTPS endpoint
    useEffect(() => {
        const supabaseUrlEnv = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
        if (supabaseUrlEnv) {
            fetch(`${supabaseUrlEnv}/rest/v1/`)
                .then(res => console.log('Supabase test status:', res.status))
                .catch(err => console.log('Supabase fetch error →', err));
        }
        fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(res => console.log('JSONPlaceholder status:', res.status))
            .catch(err => console.log('JSONPlaceholder fetch error →', err));
    }, [])

    return (
        <GluestackUIProvider mode="dark">
            <ThemedView className="flex flex-col h-full flex-1 pt-12 pb-4">
                <ThemedView className="mb-5 mx-4">
                    <Text className="text-2xl font-bold text-white">Explore</Text>
                </ThemedView>
                <View className="flex flex-row mx-4">
                    <Input
                        variant="outline"
                        width="85%"
                        size="md"
                        className="mr-2"
                    >
                        <InputField placeholder="Search books" value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={handleAISearch} />
                    </Input>
                    <Button size="md" className="rounded-full bg-emerald-700" onPress={handleAISearch}>
                        <ButtonIcon as={SearchIcon} />
                    </Button>
                </View>
                {isSearchMode && (
                    <TouchableOpacity
                        className="mx-4 mt-2"
                        onPress={() => {
                            setSearchQuery('')
                            fetchRandomBooks()
                            setIsSearchMode(false)
                        }}
                    >
                        <Text className="text-white">Return to Random Books</Text>
                    </TouchableOpacity>
                )}
                {isLoading ? (
                    <View className="flex flex-col flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="white" />
                    </View>
                ) : (
                    <View className="flex-1 mt-10 p-4">
                        {books.length > 0 ? (
                            <FlatList 
                                data={books}
                                renderItem={({item}) => (
                                    <BookCard
                                        book={item}
                                        onPress={() => setSelectedBook(item)}
                                    />
                                )}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                initialNumToRender={10}
                                maxToRenderPerBatch={10}
                                columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 10}}
                                scrollEnabled={true}
                                style={{height: 'auto'}}
                                contentContainerStyle={{paddingBottom: 20}}
                            />
                        ) : (
                            <Text className="text-white">No books found</Text>
                        )}
                    </View>
                )}

            </ThemedView>
            <BookDetailModal
              isOpen={!!selectedBook}
              book={selectedBook}
              onClose={() => setSelectedBook(null)}
            />
        </GluestackUIProvider>
    )
}