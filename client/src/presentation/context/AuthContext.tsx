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
  isAdmin: boolean;
}

// TODO: En el futuro, mover esto a una base de datos o Custom Claims de Firebase
const ADMIN_EMAILS = [
  'admin@comercialtorres.com', 
  'cpradot22_2@unc.edu.pe', // Tu correo
  'analytics-viewer@comercialtorres2.iam.gserviceaccount.com'
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const syncUserWithDb = async (authUser: User) => {
    if (!authUser.email) return;

    const name =
      authUser.displayName ||
      authUser.email?.split('@')[0] ||
      'Usuario';

    try {
      let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      if (apiUrl.endsWith('/')) {
        apiUrl = apiUrl.slice(0, -1);
      }
      if (!apiUrl.endsWith('/api') && !apiUrl.includes('localhost')) {
        apiUrl += '/api';
      }

      const response = await fetch(`${apiUrl}/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: authUser.uid,
          email: authUser.email,
          name
        })
      });

      if (!response.ok) {
        console.error('Error syncing user with backend:', await response.text());
      }
    } catch (err) {
      console.error('Error crítico en syncUserWithDb:', err);
    }
  };

  useEffect(() => {
    if (!auth) {
      console.error("Auth no inicializado. Revisa la configuración de Firebase.");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        setIsAdmin(ADMIN_EMAILS.includes(currentUser.email));
        // Sincronizar con Supabase
        await syncUserWithDb(currentUser);
      } else {
        setIsAdmin(false);
      }
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
    if (!auth) throw new Error("Firebase Auth no está inicializado");
    try {
      await updatePassword(auth.currentUser!, password);
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase Auth no está inicializado");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      loginWithEmail,
      registerWithEmail,
      resetPassword,
      updateUserPassword,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
