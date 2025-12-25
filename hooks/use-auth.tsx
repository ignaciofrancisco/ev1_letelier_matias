import { loginService } from '@/services/auth.service';
import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('token').finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user } = await loginService(email, password);
      await AsyncStorage.setItem('token', token);
      setUser(user);
      return true;
    } catch {
      return false;
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
