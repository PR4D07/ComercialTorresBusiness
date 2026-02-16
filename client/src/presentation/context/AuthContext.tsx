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
import { supabase } from '../../infrastructure/config/supabase';

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

    try {
      // 1. Verificar/Crear Usuario en tabla 'users'
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.uid)
        .maybeSingle(); // Use maybeSingle to avoid error if not found

      if (!existingUser) {
        console.log("Usuario nuevo detectado, registrando en Supabase...", authUser.uid);

        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.uid,
            email: authUser.email,
            name: authUser.displayName || authUser.email?.split('@')[0] || 'Usuario'
          });
          
        if (insertError) {
            console.error('Error creating user in DB (Detalles):', JSON.stringify(insertError, null, 2));
            // Si falla users, no intentamos customers para evitar inconsistencias
            return; 
        } else {
            console.log("Usuario registrado exitosamente en Supabase");
        }
      }

      // 2. Verificar/Crear Cliente en tabla 'customers'
      const { data: existingCustomer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', authUser.uid)
        .maybeSingle();

      if (!existingCustomer) {
        console.log("Cliente nuevo detectado, registrando perfil...", authUser.uid);
        const { error: insertCustomerError } = await supabase
          .from('customers')
          .insert({
            user_id: authUser.uid,
            email: authUser.email,
            name: authUser.displayName || authUser.email?.split('@')[0] || 'Usuario'
          });

        if (insertCustomerError) {
            console.error('Error creating customer in DB:', insertCustomerError);
        } else {
            console.log("Perfil de cliente creado exitosamente");
        }
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
