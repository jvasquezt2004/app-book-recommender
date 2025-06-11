import { Book, BookCard } from "@/components/BookCard";
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

    const fetchRandomBooks = async () => {
        try {
            setIsLoading(true)
            setIsSearchMode(false)
            
            const {data, error} = await supabase
                .from('documents')
                .select('id, metadata')
                .limit(50)

            if (error) {
                console.error('Error fetching books:', error)
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
            console.error('Exception fetching books:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const searchBooksAI = async (query: string) => {
        try {
            setIsLoading(true)
            setIsSearchMode(true)
            
            const apiUrl = `${API_BASE_URL}/search`

            const url = new URL(apiUrl)
            url.searchParams.append('query', query)
            url.searchParams.append('limit', '10')
            url.searchParams.append('offset', '0')
            
            console.log('Fetching books from API:', url.toString())

            const response = await fetch(url.toString())
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('Books fetched from API:', data)

            if (data.results && data.results.length > 0) {
                const formattedBooks = data.results.map((item: {uuid: string, metadata: any}) => ({
                    id: item.uuid,
                    metadata: item.metadata
                }))
                console.log('Formatted books:', formattedBooks)
                setBooks(formattedBooks)
            } else {
                setBooks([])
            }
        } catch (error) {
            console.error('Exception fetching books:', error)
            fetchRandomBooks()
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
                    <View className="flex-1 mt-10">
                        {books.length > 0 ? (
                            <FlatList 
                                data={books}
                                renderItem={({item}) => (
                                    <BookCard
                                        book={item}
                                        onPress={() => {
                                            
                                        }}
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
        </GluestackUIProvider>
    )
}