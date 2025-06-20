import { Book } from '@/components/BookCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

interface BookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
  bookId?: string | null;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ isOpen, onClose, book: initialBook, bookId }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialBook) {
      setBook(initialBook as Book);
      return;
    }
    if (!bookId) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', bookId)
          .single();
        if (!error && data) {
          setBook(data as Book);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [initialBook, bookId, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <ThemedText className="text-lg font-bold">Book Details</ThemedText>
          <ModalCloseButton onPress={onClose} />
        </ModalHeader>
        <ModalBody>
          {loading || !book ? (
            <ActivityIndicator size="large" />
          ) : (
            <ScrollView>
              <ThemedView className="items-center p-5 bg-gray-100 dark:bg-gray-800">
                <Image
                  source={{
                    uri: book.metadata.thumbnail || book.metadata.cover_url ||
                      'https://via.placeholder.com/300x450?text=No+Cover',
                  }}
                  style={{ width: 200, height: 300, borderRadius: 8 }}
                />
                <ThemedText className="mt-4 text-xl font-bold text-center">
                  {book.metadata.title}
                </ThemedText>
                <ThemedText className="text-gray-600 dark:text-gray-300 mt-1">
                  by {book.metadata.authors}
                </ThemedText>
              </ThemedView>
              <ThemedView className="p-4">
                <ThemedText className="font-bold mb-1">Category:</ThemedText>
                <ThemedText>{book.metadata.categories}</ThemedText>
              </ThemedView>
              <ThemedView className="p-4">
                <ThemedText className="font-bold mb-1">Description:</ThemedText>
                <ThemedText>{book.metadata.description}</ThemedText>
              </ThemedView>
              <ThemedView className="p-4">
                <ThemedText className="font-bold mb-1">Summary:</ThemedText>
                <ThemedText>{book.content}</ThemedText>
              </ThemedView>
            </ScrollView>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
