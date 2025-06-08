import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SignOutButton from '@/components/SignOutButton';

export default function HomeScreen() {
  const { user, session } = useAuth();
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      {/* Auth-conditional content */}
      {session && (
        <ThemedView style={styles.authContainer}>
          <ThemedText type="title">Welcome, {user?.email?.split('@')[0] || 'User'}!</ThemedText>
          <ThemedText>You are successfully signed in with Supabase.</ThemedText>
          <SignOutButton />
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
      
      {/* Standard app content can go below, visible to all users */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
