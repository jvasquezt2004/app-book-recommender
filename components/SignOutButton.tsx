import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";

export const SignOutButton = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Auth state change listener in AuthContext will handle redirection
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <TouchableOpacity className="bg-red-600 py-3 px-5 rounded-lg mt-4 self-center" onPress={handleSignOut}>
      <ThemedText className="text-white font-bold">Sign Out</ThemedText>
    </TouchableOpacity>
  );
};

export default SignOutButton;
