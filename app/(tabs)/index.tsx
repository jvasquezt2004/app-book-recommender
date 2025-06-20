import { Book, BookCard } from '@/components/BookCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';



import SignOutButton from '@/components/SignOutButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [bookOfDay, setBookOfDay] = useState<Book | null>(null);
  const [loadingBod, setLoadingBod] = useState(true);

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

  
  return (
    <GluestackUIProvider mode="dark">
    <ThemedView className="flex flex-col h-full flex-1 pt-12 pb-4 px-4">
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
            <BookCard book={bookOfDay} onPress={() => {}} />
          </ThemedView>
        )}
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
