import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
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
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <ThemedText style={styles.text}>Sign Out</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center'
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default SignOutButton;
