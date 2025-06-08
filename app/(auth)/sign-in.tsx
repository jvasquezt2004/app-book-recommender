import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Input, InputField } from '@/components/ui/input'
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast'
import { useAuth } from '@/contexts/AuthContext'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, TouchableOpacity, View } from 'react-native'

export default function SignInScreen() {
  const { signIn, isLoading } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSignInPress = async () => {
    if (isLoading || submitting || !email || !password) return

    try {
      setSubmitting(true)
      const { error } = await signIn(email, password)
      
      if (error) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={"toast-" + id} action="error" variant="solid">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>{error.message || 'Failed to sign in'}</ToastDescription>
              </Toast>
            )
          }
        })
        console.error('Sign in error:', error)
      } else {
        // The auth listener in AuthContext will handle redirection
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error)
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="solid">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>An unexpected error occurred</ToastDescription>
            </Toast>
          )
        }
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ThemedView className="flex-1 p-5 justify-center">
      <Heading className="mb-6 text-center text-4xl">Sign In</Heading>
      
      <View className="mb-8">
        <Input className="mb-4">
          <InputField
            className="h-12 rounded-xl text-base"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            placeholder="Email"
            onChangeText={setEmail}
          />
        </Input>
        
        <Input className="mb-4">
          <InputField
            className="h-12 rounded-xl text-base"
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </Input>
      </View>
      
      <Button
        size="lg"
        variant="solid"
        action="primary"
        isDisabled={submitting || isLoading || !email || !password}
        onPress={onSignInPress}
        className="h-12 w-full rounded-xl"
      >
        <ButtonText>{submitting ? 'Signing In...' : 'Sign In'}</ButtonText>
      </Button>
      
      <View className="mt-8 flex-row justify-center items-center space-x-2">
        <ThemedText>No account?</ThemedText>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity className="p-1">
            <ThemedText type="link">Create account</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </ThemedView>
  )
}