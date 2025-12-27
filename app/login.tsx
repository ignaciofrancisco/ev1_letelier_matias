import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { signIn, loading, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (submitting || loading) return;

    if (!email.trim() || !password.trim()) {
      setError('Debes ingresar correo y contraseña.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const success = await signIn(email, password);

    if (!success) {
      setError('Credenciales inválidas.');
    }

    setSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg shadow-slate-400/20">
            <Text className="text-center text-4xl font-black text-slate-900">
              Taskly
            </Text>

            <Text className="mt-2 text-center text-base text-slate-500">
              Inicia sesión para gestionar tus tareas
            </Text>

            <Text className="mt-6 text-center text-2xl font-semibold text-slate-900">
              Iniciar sesión
            </Text>

            <View className="mt-6">
              <Text className="mb-2 text-sm font-semibold text-slate-600">
                Correo
              </Text>
              <TextInput
                className="rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
                placeholder="correo@ejemplo.cl"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mt-4">
              <Text className="mb-2 text-sm font-semibold text-slate-600">
                Contraseña
              </Text>
              <TextInput
                className="rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {error && (
              <Text className="mt-4 text-center text-sm text-red-500">
                {error}
              </Text>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={handleSubmit}
              disabled={submitting || loading}
              className={`mt-6 items-center rounded-2xl bg-blue-600 py-3 ${
                submitting || loading ? 'opacity-70' : ''
              }`}
            >
              <Text className="text-base font-bold text-white">
                {submitting || loading ? 'Ingresando…' : 'Ingresar'}
              </Text>
            </Pressable>

            {/* 🔎 DEMOSTRACIÓN DE ESTADO (PRUEBA) */}
            <View className="mt-4 items-center">
              <Text className="text-xs text-slate-400">
                Loading: {loading ? 'true' : 'false'}
              </Text>
              <Text className="text-xs text-slate-400">
                User: {user ? user.email : 'null'}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
