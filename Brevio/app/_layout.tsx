import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F39C12' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerShown: false
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: '' }} />
      <Stack.Screen name="HomeTab" options={{ headerTitle: 'Home' }} />
      <Stack.Screen name="SignIn" options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" options={{ headerShown: false }} />
    </Stack>
  );
}
