import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/(tabs)");
    }
  }, [session]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}