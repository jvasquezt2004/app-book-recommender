import { useAuth } from '@/contexts/AuthContext';
import SignOutButton from '@/components/SignOutButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const { user, session } = useAuth();

  return (
    <GluestackUIProvider mode="dark">
      <ThemedView style={styles.container}>
        {session ? (
          <>
            <ThemedText type="title" style={styles.title}>Profile</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
            <SignOutButton />
          </>
        ) : (
          <ThemedText>You are not signed in.</ThemedText>
        )}
      </ThemedView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 16,
  },
  email: {
    marginBottom: 32,
  },
});
