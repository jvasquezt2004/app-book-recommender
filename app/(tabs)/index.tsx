import { Book, BookCard } from '@/components/BookCard';
import BookOfDayCard from '@/components/BookOfDayCard';
import { BookDetailModal } from '@/components/BookDetailModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';



import SignOutButton from '@/components/SignOutButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import React, { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [bookOfDay, setBookOfDay] = useState<Book | null>(null);
  const [newestBooks, setNewestBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loadingBod, setLoadingBod] = useState(true);
  const [loadingNewest, setLoadingNewest] = useState(true);

  const { user, session } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const stored = await AsyncStorage.getItem('bookOfDay');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.date === today && parsed.book) {
            setBookOfDay(parsed.book);
            return;
          }
        }
        // fetch random book from supabase
        const { count, error: countErr } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true });
        if (countErr) throw countErr;
        if (!count || count === 0) {
          setBookOfDay(null);
          return;
        }
        const randomIndex = Math.floor(Math.random() * count);
        const { data, error } = await supabase
          .from('documents')
          .select('id, metadata, content')
          .range(randomIndex, randomIndex);
        if (error || !data || data.length === 0) throw error || new Error('No data');
        const randomBook = data[0] as Book;
        setBookOfDay(randomBook);
        await AsyncStorage.setItem(
          'bookOfDay',
          JSON.stringify({ date: today, book: randomBook })
        );
      } catch (e) {
        console.error('Book of the day error', e);
      } finally {
        setLoadingBod(false);
      }
    })();
  }, []);

  const loadNewest = async () => {
    setLoadingNewest(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      let books: Book[] = [];
      if (!error && data) books = data as Book[];
      if (books.length === 0) {
        const { data: altData } = await supabase
          .from('documents')
          .select('*')
          .order('id', { ascending: false })
          .limit(5);
        if (altData) books = altData as Book[];
      }
      setNewestBooks(books);
    } catch (err) {
      console.error('Newest fetch error', err);
    } finally {
      setLoadingNewest(false);
    }
  };

  useEffect(() => {
    loadNewest();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadNewest();
    }, [])
  );

  
  return (
    <GluestackUIProvider mode="dark">
    <ThemedView className="flex-1">
      <ScrollView className="flex-1 pt-12 pb-4 px-4" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {session && (
          <ThemedView className="px-4 pt-4">
            <ThemedText type="title">Welcome back, {user?.email?.split('@')[0] || 'User'}!</ThemedText>
          </ThemedView>
        )}

        {!session && (
          <ThemedView style={styles.authContainer}>
            <ThemedText type="subtitle">Authentication Required</ThemedText>
            <ThemedText>Please sign in to access the full features of this app.</ThemedText>
            <View style={styles.buttonContainer}>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity style={styles.primaryButton}>
                  <ThemedText style={styles.primaryButtonText}>Sign In</ThemedText>
                </TouchableOpacity>
              </Link>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <ThemedText>Sign Up</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          </ThemedView>
        )}
        {session && (
          <ThemedView style={styles.authContainer}>
            <SignOutButton />
          </ThemedView>
        )}
        {/* Book of the Day */}
        {loadingBod ? null : bookOfDay && (
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Book of the Day</ThemedText>
            <BookOfDayCard book={bookOfDay} onPress={() => setSelectedBook(bookOfDay)} />
          </ThemedView>
        )}
        {/* Newest Entries */}
        {loadingNewest ? null : newestBooks.length > 0 && (
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Newest Entries</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-ml-4 pr-4">
              {newestBooks.map((b) => (
                <View key={b.id} className="mr-4">
                  <BookCard book={b} onPress={() => setSelectedBook(b)} widthClass="w-40" />
                </View>
              ))}
            </ScrollView>
          </ThemedView>
        )}
        <BookDetailModal isOpen={!!selectedBook} book={selectedBook || undefined} onClose={() => setSelectedBook(null)} />
      </ScrollView>
    </ThemedView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  // Auth-related styles
  authContainer: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
  },
});
