import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, LogBox, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TasksProvider } from '@/hooks/use-tasks';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

if (__DEV__) {
  LogBox.ignoreLogs([
    'SafeAreaView has been deprecated',
    'The <SafeAreaView> component has been removed from React Native',
  ]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <AuthProvider>
          <TasksProvider>
            <RootLayoutNav />
          </TasksProvider>
        </AuthProvider>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inLogin = segments[0] === 'login';

    if (!user && !inLogin) {
      router.replace('/login');
    }

    if (user && inLogin) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-base text-slate-600">
          Preparando tu experiencia…
        </Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: 'modal', title: 'Estadísticas' }}
      />
    </Stack>
  );
}
