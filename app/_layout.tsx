import { Stack } from "expo-router";
import { AuthProvider } from '../contexts/AuthContext';
import { PostProvider } from '../contexts/PostContext';
import './globals.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PostProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </PostProvider>
    </AuthProvider>
  );
}
