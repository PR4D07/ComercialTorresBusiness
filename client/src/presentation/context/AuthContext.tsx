import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
  updatePassword,
  type User
} from 'firebase/auth';
import { auth, googleProvider } from '../../infrastructure/config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error("Auth no inicializado. Revisa la configuración de Firebase.");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    if (!auth) throw new Error("Firebase Auth no está inicializado");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const additionalInfo = getAdditionalUserInfo(result);
      return additionalInfo?.isNewUser || false;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth no está inicializado");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión con correo:", error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth no está inicializado");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al registrarse:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Firebase Auth no está inicializado");
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      throw error;
    }
  };

  const updateUserPassword = async (password: string) => {
    if (!auth || !auth.currentUser) throw new Error("No hay usuario autenticado");
    try {
      await updatePassword(auth.currentUser, password);
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword, updateUserPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
