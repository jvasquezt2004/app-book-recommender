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

export default function SignUpScreen() {
  const { signUp, isLoading } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSignUpPress = async () => {
    if (isLoading || submitting) return
    
    if (password !== confirmPassword) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={"toast-" + id} action="error" variant="solid">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>Passwords do not match</ToastDescription>
            </Toast>
          )
        }
      })
      return
    }

    try {
      setSubmitting(true)
      const { error, data } = await signUp(email, password)
      
      if (error) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={"toast-" + id} action="error" variant="solid">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>{error.message || 'Failed to sign up'}</ToastDescription>
              </Toast>
            )
          }
        })
        console.error('Sign up error:', error)
      } else {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={"toast-" + id} action="success" variant="solid">
                <ToastTitle>Success</ToastTitle>
                <ToastDescription>Your account has been created! Please check your email for verification.</ToastDescription>
              </Toast>
            )
          }
        })
        // The auth listener will handle redirection if email verification is not required
      }
    } catch (error) {
      console.error('Unexpected error during sign up:', error)
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
      <Heading className="mb-6 text-center text-4xl">Create Account</Heading>
      
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
        
        <Input className="mb-4">
          <InputField
            className="h-12 rounded-xl text-base"
            value={confirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
          />
        </Input>
      </View>
      
      <Button
        size="lg"
        variant="solid"
        action="primary"
        isDisabled={submitting || isLoading || !email || !password || !confirmPassword}
        onPress={onSignUpPress}
        className="h-12 w-full rounded-xl"
      >
        <ButtonText>{submitting ? 'Creating Account...' : 'Sign Up'}</ButtonText>
      </Button>

      <View className="mt-8 flex-row justify-center items-center space-x-2">
        <ThemedText>Already have an account?</ThemedText>
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity className="p-1">
            <ThemedText type="link">Sign In</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </ThemedView>
  )
}